import React, { useContext, useState } from 'react';
import filtersContext from '../../contexts/filters/filtersContext';
import { sortMenu } from '../../data/filterBarData';
import { displayMoney } from '../../helpers/utils';

const FilterBarOptions = () => {
  const {
    sortedValue,
    setSortedValue,
    handleBrandsMenu,
    handleRAMMenu,
    handleProcessorMenu,
    handleSSDMenu,
    handleGenerationMenu,
    handlePrice,
    selectedPrice: { price, minPrice, maxPrice },
    mobFilterBar: { isMobSortVisible, isMobFilterVisible },
    handleMobSortVisibility,
    handleMobFilterVisibility,
    handleClearFilters,
    queryString,
  } = useContext(filtersContext);

  const displayPrice = displayMoney(price);

  const [openDropdown, setOpenDropdown] = useState(null);

  // Local selections (UI state) — sync with context setters
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRAM, setSelectedRAM] = useState([]);
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedSSD, setSelectedSSD] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState([]);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleSelection = (value, selectedList, setSelectedList, contextSetter) => {
    let updatedList;
    if (selectedList.includes(value)) {
      updatedList = selectedList.filter(item => item !== value);
    } else {
      updatedList = [...selectedList, value];
    }
    setSelectedList(updatedList);
    if (contextSetter) {
      contextSetter(updatedList);
    }
  };

  return (
    <>
   

      {/* Sort Menu */}
      <div className={`sort_options ${isMobSortVisible ? 'show' : ''}`}>
        <div className="sort_head">
          <h3 className="title">Sort By</h3>
          <button type="button" className="close_btn" onClick={() => handleMobSortVisibility(false)}>
            &times;
          </button>
        </div>
        <div className="separator"></div>
        <ul className="sort_menu">
          {sortMenu.map(({ id, title }) => (
            <li
              key={id}
              className={sortedValue === title ? 'active' : ''}
              onClick={() => setSortedValue(title)}
            >
              {title}
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Menu */}
      <div className={`filter_options ${isMobFilterVisible ? 'show' : ''}`}>
        <div className="filter_head">
          <h3 className="title">Filter By</h3>
          <button type="button" className="close_btn" onClick={() => handleMobFilterVisibility(false)}>
            &times;
          </button>
        </div>

        {/* Clear Filters Button inside filter panel */}
       

        <div className="separator"></div>

        {/* Brands */}
        <div className="filter_block">
          <h4>Brands</h4>
          <div className="dropdown">
            <button className="dropdown_btn" onClick={() => toggleDropdown('brands')}>
              Select Brands
            </button>
            {openDropdown === 'brands' && (
              <div className="dropdown_menu">
                {['Dell', 'HP', 'Asus', 'Lenovo', 'Apple'].map((brand, idx) => (
                  <label key={idx} className="block dropdown_item">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands, handleBrandsMenu)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RAM */}
        <div className="filter_block">
          <h4>RAM</h4>
          <div className="dropdown">
            <button className="dropdown_btn" onClick={() => toggleDropdown('ram')}>
              Select RAM
            </button>
            {openDropdown === 'ram' && (
              <div className="dropdown_menu">
                {['4GB', '6GB', '8GB', '16GB', '32GB'].map((ram, idx) => (
                  <label key={idx} className="block dropdown_item">
                    <input
                      type="checkbox"
                      checked={selectedRAM.includes(ram)}
                      onChange={() => toggleSelection(ram, selectedRAM, setSelectedRAM, handleRAMMenu)}
                    />
                    {ram}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Processor */}
        <div className="filter_block">
          <h4>Processor</h4>
          <div className="dropdown">
            <button className="dropdown_btn" onClick={() => toggleDropdown('processor')}>
              Select Processor
            </button>
            {openDropdown === 'processor' && (
              <div className="dropdown_menu">
                {['Core i5', 'Core i7', 'Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7'].map((processor, idx) => (
                  <label key={idx} className="block dropdown_item">
                    <input
                      type="checkbox"
                      checked={selectedProcessors.includes(processor)}
                      onChange={() => toggleSelection(processor, selectedProcessors, setSelectedProcessors, handleProcessorMenu)}
                    />
                    {processor}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SSD */}
        <div className="filter_block">
          <h4>SSD</h4>
          <div className="dropdown">
            <button className="dropdown_btn" onClick={() => toggleDropdown('ssd')}>
              Select SSD
            </button>
            {openDropdown === 'ssd' && (
              <div className="dropdown_menu">
                {['256GB', '512GB', '1TB'].map((ssd, idx) => (
                  <label key={idx} className="block dropdown_item">
                    <input
                      type="checkbox"
                      checked={selectedSSD.includes(ssd)}
                      onChange={() => toggleSelection(ssd, selectedSSD, setSelectedSSD, handleSSDMenu)}
                    />
                    {ssd}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generation */}
        <div className="filter_block">
          <h4>Generation</h4>
          <div className="dropdown">
            <button className="dropdown_btn" onClick={() => toggleDropdown('generation')}>
              Select Generation
            </button>
            {openDropdown === 'generation' && (
              <div className="dropdown_menu">
                {['6th Gen', '8th Gen', '10th Gen', '11th Gen'].map((gen, idx) => (
                  <label key={idx} className="block dropdown_item">
                    <input
                      type="checkbox"
                      checked={selectedGeneration.includes(gen)}
                      onChange={() => toggleSelection(gen, selectedGeneration, setSelectedGeneration, handleGenerationMenu)}
                    />
                    {gen}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="filter_block">
          <h4>Price</h4>
          <div className="price_filter">
            <p>{displayPrice}</p>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={price}
              onChange={handlePrice}
            />
          </div>
        </div>

        {/* Debug: show query string */}
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Current Query String: {queryString}
        </div>
      </div>
    </>
  );
};

export default FilterBarOptions;
