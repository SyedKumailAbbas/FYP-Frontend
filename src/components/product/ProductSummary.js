import React from 'react';
import reviewsData from '../../data/reviewsData';
import useActive from '../../hooks/useActive';
import ProductReviews from './ProductReviews';

const ProductSummary = (props) => {
    const { brand, name, description, category } = props;
    const { active, handleActive, activeClass } = useActive('price');

    // Table Data
    const data = [
        { col1: "Website 1 ", col2: "1299", col3: "link" },
        { col1: "Website 2", col2: "1400", col3: "link" },
        { col1: "Website 3", col2: "1500", col3: "link" },
    ];

    return (
        <section id="product_summary" className="section">
            <div className="container">

                {/*===== Product-Summary-Tabs =====*/}
                <div className="prod_summary_tabs">
                    <ul className="tabs">
                        <li className={`tabs_item ${activeClass('price')}`} onClick={() => handleActive('price')}>Price</li>
                        <li className={`tabs_item ${activeClass('specs')}`} onClick={() => handleActive('specs')}>Specifications</li>
                        <li className={`tabs_item ${activeClass('overview')}`} onClick={() => handleActive('overview')}>Overview</li>
                        <li className={`tabs_item ${activeClass('reviews')}`} onClick={() => handleActive('reviews')}>Reviews</li>
                    </ul>
                </div>

                {/*===== Product-Summary-Details =====*/}
                <div className="prod_summary_details">
                    {active === 'price' ? (
                        <div className="prod_specs">
                            {/* Responsive Table */}
                            <ul className="w-full border border-gray-300">
                                {/* Table Header */}
                                <li className="flex font-semibold bg-gray-800 text-white p-3">
                                    <span className="w-1/3">Name</span>
                                    <span className="w-1/3">Price </span>
                                    <span className="w-1/3">Website link</span>
                                </li>

                                {/* Dynamic Table Rows */}
                                {data.map((row, index) => (
                                    <li key={index} className="flex p-3 border-b">
                                        <span className="w-1/3">{row.col1}</span>
                                        <span className="w-1/3">{row.col2}</span>
                                        <span className="w-1/3">{row.col3}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : active === 'specs' ? (
                        <div className="prod_specs">
                            <ul>
                                <li><span>Brand</span><span>{brand}</span></li>
                                <li><span>Model</span><span>{name}</span></li>
                                <li><span>Generic Name</span><span>{category}</span></li>
                          
                            </ul>
                        </div>
                    ) : active === 'overview' ? (
                        <div className="prod_overview">
                            <h3>The <span>{name}</span> {description} provides fabulous sound quality</h3>
                            <ul>
                                <li>Sound Tuned to Perfection</li>
                                <li>Comfortable to Wear</li>
                                <li>Long Hours Playback Time</li>
                            </ul>
                            <p>
                                Buy the <b>{name} {description}</b> which offers an amazing music experience with premium sound quality.
                                Enjoy flexibility and mobility with these {category}, blending exceptional sound with smart features.
                            </p>
                        </div>
                    ) : (
                        <div className="prod_reviews">
                            <ul>
                                {reviewsData.map(item => (
                                    <ProductReviews key={item.id} {...item} />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductSummary;
