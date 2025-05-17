import axios from 'axios';
import { createContext, useEffect, useReducer, useState } from 'react';
import { brandsMenu, categoryMenu } from '../../data/filterBarData';
import filtersReducer from './filtersReducer';

const filtersContext = createContext();

const initialState = {
  allProducts: [],
  loading: true,
  sortedValue: null,
  updatedBrandsMenu: brandsMenu,
  updatedCategoryMenu: categoryMenu,
  selectedPrice: {
    price: 0,
    minPrice: 0,
    maxPrice: 0,
  },
  mobFilterBar: {
    isMobSortVisible: false,
    isMobFilterVisible: false,
  },
  filteredProducts: [],
};

const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filtersReducer, initialState);

  // Multi-select filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRAM, setSelectedRAM] = useState([]);
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedSSD, setSelectedSSD] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState([]);

  const [queryString, setQueryString] = useState('');

  const apiUrl = process.env.REACT_APP_API_URI;

  const buildQueryString = () => {
    const params = new URLSearchParams();

    // Always append minPrice = 0 as requested
    params.append('minPrice', 0);

    // Append maxPrice from state, fallback to 100000
    params.append('maxPrice', state.selectedPrice.maxPrice || 10000000);

    if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','));

    const specs = {};
    if (selectedRAM.length > 0) specs.ram = selectedRAM.join(',');
    if (selectedProcessors.length > 0) specs.processor = selectedProcessors.join(',');
    if (selectedSSD.length > 0) specs.ssd = selectedSSD.join(',');
    if (selectedGeneration.length > 0) specs.generation = selectedGeneration.join(',');

    if (Object.keys(specs).length > 0) {
      params.append('specifications', JSON.stringify(specs));
    }

    return `?${params.toString()}`;
  };

  // Update query string on any filter change
  useEffect(() => {
    const qs = buildQueryString();
    setQueryString(qs);
  }, [
    selectedBrands,
    selectedRAM,
    selectedProcessors,
    selectedSSD,
    selectedGeneration,
    state.selectedPrice.maxPrice, // maxPrice matters for query string
  ]);

  // Fetch products when queryString changes
  const fetchProducts = async () => {
    try {
      if (!queryString) return;

      console.log('Fetching products with query:', queryString);

      const response = await axios.get(`${apiUrl}/product/filterproduct/filter${queryString}`);
      const data = response.data;

      if (data && Array.isArray(data.data)) {
        const products = data.data.map(item => ({
          id: item._id,
          name: item.name,
          category: item.category,
          brand: item.specifications.brand,
          prices: item.prices || [],
          finalPrice: Math.min(...(item.prices || [0])),
          urls: item.urls || [],
          images: item.images || [],
          description: item.description || '',
          specifications: item.specifications || {},
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
        }));

        const priceArr = products.map(p => p.finalPrice);
        const minPrice = 0; // Always zero
        const maxPrice = Math.max(...priceArr);

        dispatch({
          type: 'LOAD_ALL_PRODUCTS',
          payload: { products, minPrice, maxPrice },
        });

        dispatch({
          type: 'FILTERED_PRODUCTS',
          payload: { updatedProducts: products },
        });

        dispatch({
          type: 'SET_LOADING',
          payload: { loading: false },
        });

        // Reset price filter to maxPrice on load
        dispatch({
          type: 'HANDLE_PRICE',
          payload: { value: maxPrice },
        });
      }
    } catch (error) {
      console.error('Error fetching filtered products:', error.response?.data || error.message);
      dispatch({
        type: 'SET_LOADING',
        payload: { loading: false },
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const applyFilters = () => {
    let updatedProducts = [...state.allProducts];

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
          updatedProducts = updatedProducts.sort((a, b) => a.finalPrice - b.finalPrice);
          break;
        case 'Price(Highest First)':
          updatedProducts = updatedProducts.sort((a, b) => b.finalPrice - a.finalPrice);
          break;
        default:
          break;
      }
    }

    const checkedCategoryItems = state.updatedCategoryMenu
      .filter(item => item.checked)
      .map(item => item.label.toLowerCase());

    if (checkedCategoryItems.length > 0) {
      updatedProducts = updatedProducts.filter(item =>
        checkedCategoryItems.includes(item.category.toLowerCase())
      );
    }

    if (state.selectedPrice.price) {
      updatedProducts = updatedProducts.filter(item => item.finalPrice <= state.selectedPrice.price);
    }

    dispatch({
      type: 'FILTERED_PRODUCTS',
      payload: { updatedProducts },
    });
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sortedValue, state.updatedCategoryMenu, state.selectedPrice]);

  // New function to set products directly from search
  const setProductsFromSearch = (products) => {
    const mappedProducts = products.map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      brand: item.specifications.brand,
      prices: item.prices || [],
      finalPrice: Math.min(...(item.prices || [0])),
      urls: item.urls || [],
      images: item.images || [],
      description: item.description || '',
      specifications: item.specifications || {},
      createdAt: item.createdAt || '',
      updatedAt: item.updatedAt || '',
    }));

    const priceArr = mappedProducts.map(p => p.finalPrice);
    const maxPrice = priceArr.length > 0 ? Math.max(...priceArr) : 100000;

    dispatch({
      type: 'LOAD_ALL_PRODUCTS',
      payload: { products: mappedProducts, minPrice: 0, maxPrice },
    });

    dispatch({
      type: 'FILTERED_PRODUCTS',
      payload: { updatedProducts: mappedProducts },
    });

    dispatch({
      type: 'HANDLE_PRICE',
      payload: { value: maxPrice },
    });

    dispatch({
      type: 'SET_LOADING',
      payload: { loading: false },
    });
  };

  // Dispatchers
  const setSortedValue = sortValue =>
    dispatch({ type: 'SET_SORTED_VALUE', payload: { sortValue } });

  const handleBrandsMenu = newBrands => setSelectedBrands(newBrands);
  const handleRAMMenu = newRAM => setSelectedRAM(newRAM);
  const handleProcessorMenu = newProcessors => setSelectedProcessors(newProcessors);
  const handleSSDMenu = newSSD => setSelectedSSD(newSSD);
  const handleGenerationMenu = newGeneration => setSelectedGeneration(newGeneration);

  const handleCategoryMenu = id =>
    dispatch({ type: 'CHECK_CATEGORY_MENU', payload: { id } });

  const handlePrice = event => {
    const value = event.target.value;
    dispatch({ type: 'HANDLE_PRICE', payload: { value } });
  };

  const handleMobSortVisibility = toggle =>
    dispatch({ type: 'MOB_SORT_VISIBILITY', payload: { toggle } });

  const handleMobFilterVisibility = toggle =>
    dispatch({ type: 'MOB_FILTER_VISIBILITY', payload: { toggle } });

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });

    setSelectedBrands([]);
    setSelectedRAM([]);
    setSelectedProcessors([]);
    setSelectedSSD([]);
    setSelectedGeneration([]);

    // Reset price to maxPrice (or default 100000 if missing)
    dispatch({
      type: 'HANDLE_PRICE',
      payload: { value: state.selectedPrice.maxPrice || 100000 },
    });
  };

  const values = {
    ...state,
    setSortedValue,
    handleBrandsMenu,
    handleRAMMenu,
    handleProcessorMenu,
    handleSSDMenu,
    handleGenerationMenu,
    handleCategoryMenu,
    handlePrice,
    handleMobSortVisibility,
    handleMobFilterVisibility,
    handleClearFilters,
    queryString,
    fetchProducts,
    selectedBrands,
    selectedRAM,
    selectedProcessors,
    selectedSSD,
    selectedGeneration,
    setProductsFromSearch,  // <-- added here
  };

  return (
    <filtersContext.Provider value={values}>
      {children}
    </filtersContext.Provider>
  );
};

export default filtersContext;
export { FiltersProvider };
