import React, { useState } from 'react';
import { IoMdStar } from 'react-icons/io';

const ProductReviews = ({ name, date, review, rateCount, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);

  const handleSave = () => {
    if (onEdit) onEdit(editedReview);
    setIsEditing(false);
  };

  return (
    <li>
      <div className="user_info">
        <img src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png" alt="user-img" />
        <div>
          <h4>{name}</h4>
          <div className="user_ratings">
            <span className="rating_star">
              {[...Array(rateCount)].map((_, i) => <IoMdStar key={i} />)}
            </span>
            <span>|</span>
            <span className="date">
              {date?.seconds ? new Date(date.seconds * 1000).toLocaleDateString() : 'Just now'}
            </span>
          </div>
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea value={editedReview} onChange={e => setEditedReview(e.target.value)} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <p className="user_review">{review}</p>
      )}

      {onDelete && (
        <div className="review_actions">
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default ProductReviews;
