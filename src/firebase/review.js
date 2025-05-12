import {
    doc,
    setDoc,
    getDoc,
    collection,
    updateDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    addDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase-config";

// 1. Add a review
export const addreview = async (userId, username, productId, review) => {
  try {
      const reviewsRef = collection(db, "reviews");
      const reviewData = {
          userId,
          username,
          productId,
          review, // Only the review comment
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(reviewsRef, reviewData);
      return docRef.id;
  } catch (error) {
      console.error("Failed to add review:", error.message);
      throw error;
  }
};



// 2. Edit a review
export const editreview = async (reviewId, newreview) => {
    try {
        const reviewRef = doc(db, "reviews", reviewId);
        await updateDoc(reviewRef, {
            review: newreview,
            updatedAt: Timestamp.now()
        });
        console.log("review updated successfully");
    } catch (error) {
        console.error("Failed to update review:", error.message);
        throw error;
    }
};

// 3. Delete a review
export const deletereview = async (reviewId) => {
    try {
        await deleteDoc(doc(db, "reviews", reviewId));
        console.log("review deleted successfully");
    } catch (error) {
        console.error("Failed to delete review:", error.message);
        throw error;
    }
};

// 4. Get reviews for a specific product
export const getreviewsByProductId = async (productId) => {
    try {
        const reviewsRef = collection(db, "reviews");
        const q = query(reviewsRef, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);

        const reviews = [];
        querySnapshot.forEach(doc => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        return reviews;
    } catch (error) {
        console.error("Failed to fetch reviews:", error.message);
        throw error;
    }
};
