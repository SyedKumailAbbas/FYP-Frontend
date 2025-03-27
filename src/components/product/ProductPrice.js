
import React from "react";

const ProductPrice = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <div className="hidden md:grid grid-cols-3 bg-gray-200 p-2 font-bold text-center">
        <div className="p-2 border">Column 1</div>
        <div className="p-2 border">Column 2</div>
        <div className="p-2 border">Column 3</div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 p-2 rounded-md shadow-sm hover:shadow-md"
          >
            <div className="p-2 border md:border-none">
              <strong className="md:hidden">Column 1:</strong> {row.col1}
            </div>
            <div className="p-2 border md:border-none">
              <strong className="md:hidden">Column 2:</strong> {row.col2}
            </div>
            <div className="p-2 border md:border-none">
              <strong className="md:hidden">Column 3:</strong> {row.col3}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPrice;
