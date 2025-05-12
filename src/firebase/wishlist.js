import {
  doc,
  collection,
  deleteDoc,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase-config";

// Add a product to wishlist
export const addToWishlist = async (userId, productId) => {
  try {
    const wishlistRef = collection(db, "wishlist");
    const docRef = await addDoc(wishlistRef, {
      userId,
      productId,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Failed to add to wishlist:", error.message);
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (wishlistId) => {
  try {
    await deleteDoc(doc(db, "wishlist", wishlistId));
    console.log("Wishlist item removed");
  } catch (error) {
    console.error("Failed to remove from wishlist:", error.message);
    throw error;
  }
};

// Get all wishlist items for a user
export const getWishlistByUserId = async (userId) => {
  try {
    const wishlistRef = collection(db, "wishlist");
    const q = query(wishlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const wishlist = [];
    querySnapshot.forEach((doc) => {
      wishlist.push({ id: doc.id, ...doc.data() });
    });
    return wishlist;
  } catch (error) {
    console.error("Failed to fetch wishlist:", error.message);
    throw error;
  }
};
