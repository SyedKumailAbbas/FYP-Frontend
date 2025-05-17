import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/auth/auth';
import { getWishlistByUserId, removeFromWishlist } from '../firebase/wishlist';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      try {
        const list = await getWishlistByUserId(currentUser.uid);
        console.log('Wishlist from Firebase:', list);
        setWishlist(list);

        if (list.length === 0) {
          setProducts([]);
          return;
        }

        const productPromises = list.map(item =>
          axios.get(`${process.env.REACT_APP_API_URI}/product/products/${item.productId}`)
        );
        const responses = await Promise.all(productPromises);

        const fetchedProducts = responses
          .map(res => res.data?.data?.product)
          .filter(Boolean);

        console.log('Fetched products:', fetchedProducts);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

      const updatedWishlist = wishlist.filter(item => item.productId !== productId);
      setWishlist(updatedWishlist);

      const updatedProducts = products.filter(product => product._id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleNavigateToProduct = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  // No wishlist UI
  if (!wishlist.length) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mt-20 mb-6">Your Wishlist is Empty</h1>
        <p className="text-lg mb-6">You haven't added any products to your wishlist yet.</p>
        <button
          onClick={() => navigate('/all-products')}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Wishlist UI
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mt-10 mb-4">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map(product => (
          <div key={product?._id} className="p-4 border rounded shadow">
            <div
              onClick={() => handleNavigateToProduct(product._id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') handleNavigateToProduct(product._id); }}
            >
              <h2 className="text-xl text-white font-semibold">{product?.name}</h2>
            </div>

            <button
              onClick={() => handleRemove(product?._id)}
              className="mt-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
