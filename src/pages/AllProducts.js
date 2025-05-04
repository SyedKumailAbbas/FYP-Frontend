import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { BsExclamationCircle } from 'react-icons/bs';
import useDocTitle from '../hooks/useDocTitle';
import FilterBar from '../components/filters/FilterBar';
import ProductCard from '../components/product/ProductCard';
import Services from '../components/common/Services';
import filtersContext from '../contexts/filters/filtersContext';
import EmptyView from '../components/common/EmptyView';

const AllProducts = () => {
    useDocTitle('All Products');
    const { allProducts, loading, fetchProducts } = useContext(filtersContext); // Assuming fetchProducts is a function in context
    const location = useLocation(); // Get the location to detect route changes

    // Log allProducts and loading state
    console.log("All Products in AllProducts:", allProducts);
    console.log("Loading Status:", loading);

    // Trigger product fetch on route change
    useEffect(() => {
        fetchProducts(); // Trigger fetchProducts whenever the route changes
    }, [location]); // Dependency on location ensures effect runs on route change

    // Show loading message until products are loaded
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <section id="all_products" className="section">
                <FilterBar />

                <div className="container">
                    {
                        allProducts.length ? (
                            <div className="wrapper products_wrapper">
                                {
                                    allProducts.map(item => (
                                        <ProductCard
                                            key={item.id}
                                            {...item}
                                        />
                                    ))
                                }
                            </div>
                        ) : (
                            <EmptyView
                                icon={<BsExclamationCircle />}
                                msg="No Results Found"
                            />
                        )
                    }
                </div>
            </section>

            <Services />
        </>
    );
};

export default AllProducts;
