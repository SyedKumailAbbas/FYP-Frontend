import React, { useEffect, useState } from 'react';
import useActive from '../../hooks/useActive';
import ProductReviews from './ProductReviews';
import { useAuth } from '../../contexts/auth/auth';
import {
  getreviewsByProductId,
  addreview,
  editreview,
  deletereview,
} from '../../firebase/review';

const ProductSummary = (props) => {
  const {_id, brand, name, specifications, category, prices, urls } = props;
  const { active, handleActive, activeClass } = useActive('price');
  const { currentUser, username, userLoggedIn } = useAuth();
const productId= _id
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rateCount, setRateCount] = useState(5);

  const userInfo = currentUser
  ? { id: currentUser.uid, name: currentUser.displayName || 'Anonymous' }
  : null;


  const data = urls.map((u, index) => ({
    col1: u.websiteName,
    col2: prices[index],
    col3: u.url,
  }));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetched = await getreviewsByProductId(productId);
        setReviews(fetched);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [productId]);

 const handleAddReview = async () => {
  if (!newReview.trim()) return;
  try {
    const id = await addreview(userInfo.id, userInfo.name, productId, newReview);  // Only send the review text
    setReviews(prev => [
      ...prev,
      {
        id,
        userId: userInfo.id,
        username: userInfo.name,
        review: newReview, // Just the review comment
        createdAt: new Date(),
      },
    ]);
    setNewReview('');  // Reset the review textarea
  } catch (err) {
    console.error("Add review failed:", err);
  }
};


  const handleDelete = async (id) => {
    try {
      await deletereview(id);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error("Delete review failed:", err);
    }
  };

  const handleEdit = async (id, newText) => {
    try {
      await editreview(id, newText);
      setReviews(reviews.map(r => (r.id === id ? { ...r, review: newText } : r)));
    } catch (err) {
      console.error("Edit review failed:", err);
    }
  };

  return (
    <section id="product_summary" className="section">
      <div className="container">
        <div className="prod_summary_tabs">
          <ul className="tabs">
            <li className={`tabs_item ${activeClass('price')}`} onClick={() => handleActive('price')}>Price</li>
            <li className={`tabs_item ${activeClass('specs')}`} onClick={() => handleActive('specs')}>Specifications</li>
            <li className={`tabs_item ${activeClass('reviews')}`} onClick={() => handleActive('reviews')}>Reviews</li>
          </ul>
        </div>

        <div className="prod_summary_details">
          {active === 'price' ? (
            <div className="w-full flex justify-center my-8">
              <div className="w-2/3 max-w-6xl overflow-x-auto rounded-md shadow-lg">
                <div className="flex font-semibold bg-gray-800 text-white px-6 py-3">
                  <div className="w-1/4 text-right">Name</div>
                  <div className="w-1/4 text-right">Price</div>
                  <div className="w-2/4 text-right">Website Link</div>
                </div>
                {data.map((row, index) => (
                  <div key={index} className="flex px-6 py-3 text-gray-200">
                    <div className="w-1/4 truncate text-right">{row.col1}</div>
                    <div className="w-1/4 text-right">{row.col2}</div>
                    <div className="w-2/4 break-words text-right">
                      <a href={row.col3} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                        {row.col1}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : active === 'specs' ? (
            <div className="prod_specs">
              <ul>
                <li><span>Brand</span><span>{specifications.Brand}</span></li>
                <li><span>Processor</span><span>{specifications.Processor}</span></li>
                <li><span>Generation</span><span>{specifications.Generation}</span></li>
                <li><span>Ram</span><span>{specifications.Ram}</span></li>
                <li><span>SSD</span><span>{specifications.SSD}</span></li>

              </ul>
            </div>
          )  : (
            <div className="prod_reviews">
              <ul>
                {reviews.map(item => (
                  <ProductReviews
                    key={item.id}
                    {...item}
                    date={item.createdAt}
                    onDelete={item.userId === userInfo?.id ? () => handleDelete(item.id) : null}
                    onEdit={item.userId === userInfo?.id ? (newText) => handleEdit(item.id, newText) : null}
                  />
                ))}
              </ul>

              {userLoggedIn && (
             <div className="review_input_form">
  <textarea
    placeholder="Write your review..."
    value={newReview}
    onChange={(e) => setNewReview(e.target.value)}
  />
  <button className='btn bg-red-400' onClick={handleAddReview}>Submit Review</button>
</div>

              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSummary;
