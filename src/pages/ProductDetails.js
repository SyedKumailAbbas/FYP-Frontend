import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { calculateDiscount, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import useActive from '../hooks/useActive';
import cartContext from '../contexts/cart/cartContext';
import { useAuth } from '../contexts/auth/auth';
import axios from 'axios';
import SectionsHead from '../components/common/SectionsHead';
import RelatedSlider from '../components/sliders/RelatedSlider';
import ProductSummary from '../components/product/ProductSummary';
import Services from '../components/common/Services';
import Graph from '../components/product/Graph';
import Heart from 'react-heart';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUserId,
} from '../firebase/wishlist'; // ✅ Import Firebase wishlist utils

const ProductDetails = () => {
  useDocTitle('Product Details');

  const { handleActive, activeClass } = useActive(0);
  const { addItem } = useContext(cartContext);
  const { productId } = useParams();
  const { userLoggedIn, currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [previewImg, setPreviewImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null); // to track document ID for removal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch product
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/product/products/${productId}`);
        if (response.data.success) {
          setProduct(response.data.data);
          setPreviewImg(response.data.data.images?.[0] || '');
        } else {
          console.error("Error: Product not found");
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  // Check if the product is already in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (userLoggedIn && currentUser?.uid && productId) {
        const wishlistItems = await getWishlistByUserId(currentUser.uid);
        const item = wishlistItems.find(w => w.productId === productId);
        if (item) {
          setIsWishlisted(true);
          setWishlistId(item.id); // Save document ID
        }
      }
    };

    checkWishlist();
  }, [userLoggedIn, currentUser, productId]);

  const handleAddItem = () => {
    addItem(product);
  };

  const handlePreviewImg = (i) => {
    setPreviewImg(product.images[i]);
    handleActive(i);
  };

  const handleWishlistToggle = async () => {
    if (!userLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 2000);
      return;
    }

    try {
      if (isWishlisted) {
        // Remove from Firestore
        await removeFromWishlist(wishlistId);
        setWishlistId(null);
        setIsWishlisted(false);
      } else {
        // Add to Firestore
        const id = await addToWishlist(currentUser.uid, productId);
        setWishlistId(id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  const newPrice = displayMoney(product.prices[0]);
  const oldPrice = product.prices.length > 1 ? displayMoney(product.prices[1]) : null;
  const discountedPrice = oldPrice ? product.prices[0] - product.prices[1] : 0;
  const savedPrice = displayMoney(discountedPrice);
  const savedDiscount = oldPrice ? calculateDiscount(discountedPrice, product.prices[0]) : null;

  return (
    <>
      <section id="product_details" className="section">
        <div className="container">
          <div className="wrapper prod_details_wrapper">

            <div className="prod_details_left_col">
              <div className="prod_details_tabs">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`tabs_item ${activeClass(i)}`}
                    onClick={() => handlePreviewImg(i)}
                  >
                    <img src={img} alt="product-img" />
                  </div>
                ))}
              </div>
              <figure className="prod_details_img">
                <img src={previewImg} alt="product-img" />
              </figure>
            </div>

            <div className="prod_details_right_col">
              <h1 className="prod_details_title">{product.name}</h1>
              <h4 className="prod_details_info">{product.description}</h4>
              <h5 className="prod_details_brand">Brand: {product.brand}</h5>

              <div className="separator"></div>

              <div className="prod_details_offers">
                <Graph />
              </div>

              <button onClick={handleAddItem} className="prod_details_add_to_cart">
                Add to Cart
              </button>

              <div className="prod_details_wishlist">
                <Heart
  isActive={isWishlisted}
  onClick={handleWishlistToggle}
  animationTrigger="both"
  inactiveColor="rgba(255,125,125,.75)"
  activeColor="#e019ae"
  animationDuration={0.1}
  style={{
    width: '24px',  // Adjust width
    height: '24px', // Adjust height
    marginTop: '1rem',
  }}
/>

                {showLoginPrompt && (
                  <div className="login-prompt">Please log in to add to wishlist.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <ProductSummary {...product} />

      <section id="related_products" className="section">
        <div className="container">
          <SectionsHead heading="Related Products" />
          <RelatedSlider category={product.category} />
        </div>
      </section>

      <Services />
    </>
  );
};

export default ProductDetails;
