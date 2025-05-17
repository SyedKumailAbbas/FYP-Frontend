import React, { useContext } from 'react';
import HeroSlider from '../components/sliders/HeroSlider';
import SectionsHead from '../components/common/SectionsHead';
import Services from '../components/common/Services';
import AllProducts from './AllProducts';
import filtersContext from '../contexts/filters/filtersContext';

const Home = () => {
  const { allProducts } = useContext(filtersContext);

  // Take first 16 products for home display
  const homeProducts = allProducts.slice(0, 16);

  return (
    <main>
      <section id="hero">
        <HeroSlider />
      </section>

      <section id="products" className="section">
        <div className="bg-white w-full px-4 sm:px-6 lg:px-8">
          {/* <SectionsHead heading="Products" /> */}
          {/* <AllProducts productsToShow={homeProducts} /> */}
        </div>
      </section>

      {/* Optionally render services only on non-home pages */}
      {/* <Services /> */}
    </main>
  );
};

export default Home;
