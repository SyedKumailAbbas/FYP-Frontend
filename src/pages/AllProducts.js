import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/filters/FilterBar';
import ProductCard from '../components/product/ProductCard';
import Services from '../components/common/Services';
import filtersContext from '../contexts/filters/filtersContext';
import EmptyView from '../components/common/EmptyView';
import Spinner from '../contexts/common/spinner';

const AllProducts = ({ productsToShow }) => {
  useDocTitle('All Products');
  const { allProducts, loading, fetchProducts } = useContext(filtersContext);
  const location = useLocation();

  // Check if current path is home
  const isHomePage = location.pathname === '/';

  // Items per page for paginated views
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!productsToShow) {
      // Fetch products only if not passed fixed products list
      fetchProducts();
    }
    setCurrentPage(1);
  }, [location, productsToShow]);

  if (loading) return <Spinner />;

  // Use fixed products if passed via props, else paginate full list
  const currentProducts = productsToShow
    ? productsToShow
    : allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show pagination & filter bar only if NOT passed fixed products (i.e. on non-home pages)
  const showFilterBar = !productsToShow && !isHomePage;
  const showPagination = !productsToShow && !isHomePage && totalPages > 1;

  return (
    <>
      <section id="all_products" className="section">
        {showFilterBar && <FilterBar />}

        <div className={productsToShow || isHomePage ? 'w-full px-4 sm:px-6 lg:px-8' : 'container'}>
          {currentProducts.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>

              {showPagination && (
                <div className="pagination flex justify-center mt-8 gap-4">
                  <button
                    className="px-4 py-2 bg-red-600 border rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    Prev
                  </button>

                  <button
                    className="px-4 py-2 bg-red-600 border rounded disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyView icon={<BsExclamationCircle />} msg="No Results Found" />
          )}
        </div>
      </section>

      {!productsToShow && <Services />}
    </>
  );
};

export default AllProducts;
