import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/auth/auth';
import { getWishlistByUserId, removeFromWishlist } from '../firebase/wishlist';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchWishlist = async () => {
      try {
        const list = await getWishlistByUserId(currentUser.uid);
        setWishlist(list);

        const productPromises = list.map(item =>
          axios.get(`${process.env.REACT_APP_API_URI}/product/products/${item.productId}`)
        );
        const responses = await Promise.all(productPromises);
        setProducts(responses.map(res => res.data));
        console.log(products)
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  const handleRemove = async (wishlistId) => {
    await removeFromWishlist(wishlistId);
    setWishlist(wishlist.filter(item => item.id !== wishlistId));
    setProducts(products.filter((_, i) => wishlist[i].id !== wishlistId));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => (
          <div key={wishlist[index].id} className="p-4 border rounded shadow">
            <h2 className="text-xl text-white font-semibold">{product.data.name}</h2>
            <p>{product.description}</p>
            <button
              onClick={() => handleRemove(wishlist[index].id)}
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
