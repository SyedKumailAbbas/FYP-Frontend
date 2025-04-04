import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoMdStar, IoMdCheckmark } from 'react-icons/io';
import { calculateDiscount, displayMoney } from '../helpers/utils';
import useDocTitle from '../hooks/useDocTitle';
import useActive from '../hooks/useActive';
import cartContext from '../contexts/cart/cartContext';
import product_data from '../data/product';
import SectionsHead from '../components/common/SectionsHead';
import RelatedSlider from '../components/sliders/RelatedSlider';
import ProductSummary from '../components/product/ProductSummary';
import Services from '../components/common/Services';

const ProductDetails = () => {

    useDocTitle('Product Details');

  
    const { handleActive, activeClass } = useActive(0);

    const { addItem } = useContext(cartContext);

    const { productId } = useParams();

    const product = product_data.find(item => item.id === productId) || {}; // ✅ Always ensure product is an object

    const [previewImg, setPreviewImg] = useState(product.images?.[0] || '');
    
    useEffect(() => {
        if (product.images?.length) {
            setPreviewImg(product.images[0]);
            handleActive(0);
        setPreviewImg(images[0]);

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.images]); // ✅ Using `product.images` directly instead of re-setting `images`
    
    // ✅ Conditional return AFTER all hooks execute
    if (!product.id) {
        return <h2>Product not found</h2>;
    }
    
    const { images = [], name, description, category, prices = [], ratings, rateCount } = product;
    

    // handling Add-to-cart
    const handleAddItem = () => {
        addItem(product);
    };


  

    // handling Preview image
    const handlePreviewImg = (i) => {
        setPreviewImg(images[i]);
        handleActive(i);
    };


    // calculating Prices
    const discountedPrice = prices[0] - prices[2];
    const newPrice = displayMoney(prices[2]);
    const oldPrice = displayMoney(prices[0]);
    const savedPrice = displayMoney(discountedPrice);
    const savedDiscount = calculateDiscount(discountedPrice, prices[0]);


    return (
        <>
            <section id="product_details" className="section">
                <div className="container">
                    <div className="wrapper prod_details_wrapper">

                        {/*=== Product Details Left-content ===*/}
                        <div className="prod_details_left_col">
                            <div className="prod_details_tabs">
                                {
                                    images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`tabs_item ${activeClass(i)}`}
                                            onClick={() => handlePreviewImg(i)}
                                        >
                                            <img src={img} alt="product-img" />
                                        </div>
                                    ))
                                }
                            </div>
                            <figure className="prod_details_img">
                                <img src={previewImg} alt="product-img" />
                            </figure>
                        </div>

                        {/*=== Product Details Right-content ===*/}
                        <div className="prod_details_right_col">
                            <h1 className="prod_details_title">{name}</h1>
                            <h4 className="prod_details_info">{description}</h4>


                            <div className="separator"></div>

                           


                            <div className="prod_details_offers">
                                {/* <h4>Offers and Discounts</h4>
                                <ul>
                                    <li>No Cost EMI on Credit Card</li>
                                    <li>Pay Later & Avail Cashback</li>
                                </ul> */}
                            </div>

                          

                        </div>
                    </div>
                </div>
            </section>

            <ProductSummary {...product} />

            <section id="related_products" className="section">
                <div className="container">
                    <SectionsHead heading="Related Products" />
                    <RelatedSlider category={category} />
                </div>
            </section>

            <Services />
        </>
    );
};

export default ProductDetails;