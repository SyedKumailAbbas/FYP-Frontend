import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { calculateDiscount, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import useActive from '../hooks/useActive';
import cartContext from '../contexts/cart/cartContext';
import axios from 'axios'; // Import axios
import SectionsHead from '../components/common/SectionsHead';
import RelatedSlider from '../components/sliders/RelatedSlider';
import ProductSummary from '../components/product/ProductSummary';
import Services from '../components/common/Services';
import Graph from '../components/product/Graph';

const ProductDetails = () => {

    useDocTitle('Product Details');
  
    const { handleActive, activeClass } = useActive(0);
    const { addItem } = useContext(cartContext);
    const { productId } = useParams();
    
    const [product, setProduct] = useState(null);
    const [previewImg, setPreviewImg] = useState('');
    const [loading, setLoading] = useState(true);  // Loading state for async data fetching

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);  // Start loading
                const response = await axios.get(`${process.env.REACT_APP_API_URI}/product/products/${productId}`);
                console.log(response.data);  // Log the response to check the data structure
                if (response.data.success) {
                    setProduct(response.data.data);  // Set product data from `data`
                    setPreviewImg(response.data.data.images?.[0] || '');  // Set the first image as preview
                } else {
                    console.error("Error: Product not found");
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchProductData();  // Fetch product data on component mount
    }, [productId]);

    // ✅ Conditional return AFTER all hooks execute
    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!product) {
        return <h2>Product not found</h2>;
    }

    const { images = [], name, description, category, prices = [], brand } = product;

    // Handling Add-to-cart
    const handleAddItem = () => {
        addItem(product);
    };

    // Handling Preview image
    const handlePreviewImg = (i) => {
        setPreviewImg(images[i]);
        handleActive(i);
    };

    // Calculating Prices
    const newPrice = displayMoney(prices[0]);  // Assuming prices[0] is the current price
    const oldPrice = prices.length > 1 ? displayMoney(prices[1]) : null;  // If there's an old price
    const discountedPrice = oldPrice ? prices[0] - prices[1] : 0;
    const savedPrice = displayMoney(discountedPrice);
    const savedDiscount = oldPrice ? calculateDiscount(discountedPrice, prices[0]) : null;

    return (
        <>
            <section id="product_details" className="section">
                <div className="container">
                    <div className="wrapper prod_details_wrapper">

                        {/*=== Product Details Left-content ===*/}
                        <div className="prod_details_left_col">
                            <div className="prod_details_tabs">
                                {
                                    images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`tabs_item ${activeClass(i)}`}
                                            onClick={() => handlePreviewImg(i)}
                                        >
                                            <img src={img} alt="product-img" />
                                        </div>
                                    ))
                                }
                            </div>
                            <figure className="prod_details_img">
                                <img src={previewImg} alt="product-img" />
                            </figure>
                        </div>

                        {/*=== Product Details Right-content ===*/}
                        <div className="prod_details_right_col">
                            <h1 className="prod_details_title">{name || 'Loading...'}</h1>
                            <h4 className="prod_details_info">{description || 'No description available'}</h4>
                            <h5 className="prod_details_brand">Brand: {brand || 'N/A'}</h5>

                            <div className="separator"></div>

                           

                            <div className="prod_details_offers">
                                <Graph /> {/* Graph component */}
                            </div>

                            {/* Add-to-cart Button */}
                            <button onClick={handleAddItem} className="prod_details_add_to_cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </section>

            <ProductSummary {...product} /> {/* Product Summary component */}

            <section id="related_products" className="section">
                <div className="container">
                    <SectionsHead heading="Related Products" /> {/* Section Head component */}
                    <RelatedSlider category={category} /> {/* Related Products Slider */}
                </div>
            </section>

            <Services /> {/* Services component */}
        </>
    );
};

export default ProductDetails;
