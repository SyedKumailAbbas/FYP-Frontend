import axios from 'axios';
import { createContext, useEffect, useReducer } from 'react';
import { brandsMenu, categoryMenu } from '../../data/filterBarData';
import filtersReducer from './filtersReducer';

// Filters-Context
const filtersContext = createContext();

// Initial State
const initialState = {
    allProducts: [],
    loading: true, // Start with loading as true
    sortedValue: null,
    updatedBrandsMenu: brandsMenu,
    updatedCategoryMenu: categoryMenu,
    selectedPrice: {
        price: 0,
        minPrice: 0,
        maxPrice: 0
    },
    mobFilterBar: {
        isMobSortVisible: false,
        isMobFilterVisible: false,
    },
};

// Filters-Provider Component
const FiltersProvider = ({ children }) => {
    const [state, dispatch] = useReducer(filtersReducer, initialState);

    const apiUrl = process.env.REACT_APP_API_URI;

    // Function to fetch products
    const fetchProducts = async () => {
        try {
            // Axios request to fetch products from the backend
            const response = await axios.get(`${apiUrl}/product/products`);
            const data = response.data;

            console.log("Fetched Data:", data); // Check if data is fetched correctly

            if (data && Array.isArray(data.data)) { // Ensure we're accessing the correct part of the response
                const products = data.data.map(item => ({
                    id: item._id,  // Renaming _id to id
                    name: item.name,
                    category: item.category,
                    brand: item.specifications.brand,
                    prices: item.prices || [],  // Ensure prices is always an array
                    finalPrice: Math.min(...(item.prices || [0])),  // Calculate finalPrice from the prices array
                    urls: item.urls.map(url => ({
                        websiteName: url.websiteName,
                        url: url.url,
                        lastUpdated: url.lastUpdated,
                    })) || [],
                    images: item.images || [],  // Ensure images is an array
                    description: item.description || "",  // Default to an empty string if missing
                    specifications: item.specifications || {},
                    createdAt: item.createdAt || "",
                    updatedAt: item.updatedAt || "",
                }));

                const priceArr = products.map(item => item.finalPrice);
                const minPrice = Math.min(...priceArr);
                const maxPrice = Math.max(...priceArr);

                console.log("Transformed Products:", products); // Log transformed data

                // Dispatch the action to load products into the state
                dispatch({
                    type: 'LOAD_ALL_PRODUCTS',
                    payload: { products, minPrice, maxPrice }
                });

                // Dispatch SET_LOADING to set loading to false
                dispatch({
                    type: 'SET_LOADING',
                    payload: { loading: false } // Set loading to false here
                });
            }
        } catch (error) {
            // Handle error gracefully
            console.error("Error fetching products:", error.response ? error.response.data : error.message);
            // Set loading to false in case of an error
            dispatch({
                type: 'SET_LOADING',
                payload: { loading: false }
            });
        }
    };

    /* Loading All Products on the initial render */
    useEffect(() => {
        fetchProducts();
    }, [apiUrl]);  // Ensure fetch runs only once

    /* function for applying Filters - (sorting & filtering) */
    const applyFilters = () => {
        let updatedProducts = state.allProducts.map(item => ({
            ...item,
            finalPrice: Math.min(...item.prices) // Ensure finalPrice is always set correctly
        }));

        /*==== Sorting ====*/
        if (state.sortedValue) {
            switch (state.sortedValue) {
                case 'Latest':
                    updatedProducts = updatedProducts.slice(0, 6);
                    break;

                case 'Featured':
                    updatedProducts = updatedProducts.filter(item => item.tag === 'featured-product');
                    break;

                case 'Top Rated':
                    updatedProducts = updatedProducts.filter(item => item.rateCount > 4);
                    break;

                case 'Price(Lowest First)':
                    updatedProducts = updatedProducts.sort((a, b) => Math.min(...a.prices) - Math.min(...b.prices));
                    break;

                case 'Price(Highest First)':
                    updatedProducts = updatedProducts.sort((a, b) => Math.max(...b.prices) - Math.max(...a.prices));
                    break;

                default:
                    throw new Error('Wrong Option Selected');
            }
        }

        /*==== Filtering ====*/

        // Filter by Brands
        const checkedBrandItems = state.updatedBrandsMenu
            .filter(item => item.checked)
            .map(item => item.label.toLowerCase());

        if (checkedBrandItems.length) {

            updatedProducts = updatedProducts.filter(item => {
                // Check if item.specifications.brand is defined and not empty
                const brand = item.specifications.brand ? item.specifications.brand.toLowerCase() : '';
                return checkedBrandItems.includes(brand);
            });        }

        // Filter by Category
        const checkedCategoryItems = state.updatedCategoryMenu
            .filter(item => item.checked)
            .map(item => item.label.toLowerCase());

        if (checkedCategoryItems.length) {
            updatedProducts = updatedProducts.filter(item => checkedCategoryItems.includes(item.category.toLowerCase()));
        }

        // Filter by Price
        if (state.selectedPrice) {
            updatedProducts = updatedProducts.filter(item => Math.min(...item.prices) <= state.selectedPrice.price);
        }

        dispatch({
            type: 'FILTERED_PRODUCTS',
            payload: { updatedProducts }
        });
    };

    useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sortedValue, state.updatedBrandsMenu, state.updatedCategoryMenu, state.selectedPrice]);

    // Dispatched Actions
    const setSortedValue = (sortValue) => {
        return dispatch({
            type: 'SET_SORTED_VALUE',
            payload: { sortValue }
        });
    };

    const handleBrandsMenu = (id) => {
        return dispatch({
            type: 'CHECK_BRANDS_MENU',
            payload: { id }
        });
    };

    const handleCategoryMenu = (id) => {
        return dispatch({
            type: 'CHECK_CATEGORY_MENU',
            payload: { id }
        });
    };

    const handlePrice = (event) => {
        const value = event.target.value;
        return dispatch({
            type: 'HANDLE_PRICE',
            payload: { value }
        });
    };

    const handleMobSortVisibility = (toggle) => {
        return dispatch({
            type: 'MOB_SORT_VISIBILITY',
            payload: { toggle }
        });
    };

    const handleMobFilterVisibility = (toggle) => {
        return dispatch({
            type: 'MOB_FILTER_VISIBILITY',
            payload: { toggle }
        });
    };

    const handleClearFilters = () => {
        return dispatch({
            type: 'CLEAR_FILTERS'
        });
    };

    // Context values
    const values = {
        ...state,
        setSortedValue,
        handleBrandsMenu,
        handleCategoryMenu,
        handlePrice,
        handleMobSortVisibility,
        handleMobFilterVisibility,
        handleClearFilters,
        fetchProducts, // Make sure to include fetchProducts in context
    };

    return (
        <filtersContext.Provider value={values}>
            {children}
        </filtersContext.Provider>
    );
};

export default filtersContext;
export { FiltersProvider };
