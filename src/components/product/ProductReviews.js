import React, { useState } from 'react';

const ProductReviews = ({ id, userId, username, review, date, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(review);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText);
      setEditing(false);
    }
  };

  return (
    <li className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-blue-600">@{username}</span>
        <span className="text-xs text-gray-500">{new Date(date).toLocaleString()}</span>
      </div>

      {editing ? (
        <div className="flex flex-col gap-2 mt-2">
          <textarea
            className="w-full p-2 border rounded"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-white text-sm mt-1">{review}</div>
      )}

      {onDelete && !editing && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setEditing(true)}
            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default ProductReviews;
