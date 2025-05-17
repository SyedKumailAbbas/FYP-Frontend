import React, { useContext, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import commonContext from '../../contexts/common/commonContext';
import filtersContext from '../../contexts/filters/filtersContext'; // import FiltersContext
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';

const SearchBar = () => {
const { isSearchOpen, toggleSearch, searchResults, setSearchResults } = useContext(commonContext);
  const { setProductsFromSearch } = useContext(filtersContext); // get from FiltersContext
  const searchRef = useRef();

  const closeSearch = () => {
    toggleSearch(false);
    setSearchResults([]);
  };

  useOutsideClose(searchRef, closeSearch);
  useScrollDisable(isSearchOpen);

  const handleSearching = async (e) => {
    const searchedTerm = e.target.value.trim();

    if (!searchedTerm) {
      setSearchResults([]);
      setProductsFromSearch([]);  // clear products in context on empty search
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/product/search?query=${encodeURIComponent(searchedTerm)}`);
      if (response.data.success) {
        setSearchResults(response.data.data);
        setProductsFromSearch(response.data.data);  // update products in filters context
      } else {
        setSearchResults([]);
        setProductsFromSearch([]);  // clear on no success
      }
    } catch (error) {
      console.error('Search API error:', error);
      setSearchResults([]);
      setProductsFromSearch([]);  // clear on error
    }
  };

  return (
    <>
      {isSearchOpen && (
        <div id="searchbar" className="backdrop">
          <div className="searchbar_content" ref={searchRef}>
            <div className="search_box">
              <input
                type="search"
                className="input_field"
                placeholder="Search for product..."
                onChange={handleSearching}
              />
            </div>

            {searchResults.length > 0 && (
              <div className="search_results">
                {searchResults.map(item => (
                  <Link to={`/product-details/${item._id}`} onClick={closeSearch} key={item._id}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
