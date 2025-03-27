import React from 'react';
import HeroSlider from '../components/sliders/HeroSlider';
import SectionsHead from '../components/common/SectionsHead';
import TopProducts from '../components/product/TopProducts';
import Services from '../components/common/Services';


const Home = () => {

    return (
        <main>
            <section id="hero">
                <HeroSlider />
            </section>

          

            <section id="products" className="section">
                <div className="container">
                    <SectionsHead heading="Products" />
                    <TopProducts />
                </div>
            </section>

            {/* <Services /> */}
        </main>
    );
};

export default Home;;