import React, { useContext } from 'react'; // Ensure you import useContext
import { IoMdStar } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { displayMoney } from '../../helpers/utils';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';

const ProductCard = (props) => {
    // Log props to check if data is passed correctly

    // Destructure the props object
    const { id, images, name, description, prices, originalPrice, rateCount, path } = props;

    // Check if each prop has the correct data
 

    const { addItem } = useContext(cartContext); // Ensure useContext is used correctly
    const { active, handleActive, activeClass } = useActive(false);

    // Handling Add-to-cart
    const handleAddItem = () => {
        const item = { ...props };
        addItem(item);

        handleActive(id);

        setTimeout(() => {
            handleActive(false);
        }, 3000);
    };

    const newPrice = prices && prices.length > 0 ? displayMoney(prices[0]) : "N/A";

    return (
        <>
            <div className="card products_card">
                <figure className="products_img">
                    <Link to={`/product-details/${id}`}>
                        <img src={images[0]} alt="product-img" />
                    </Link>
                </figure>
                <div className="products_details">

                    <h3 className="products_title">
                        <Link to={`/product-details/${id}`}>{name}</Link>
                    </h3>
                    <h5 className="products_info">{description}</h5>
                    <div className="separator"></div>
                    <h2 className="products_price">
                        <h6 className="products_title">
                            Starting From
                        </h6>
                        {newPrice} &nbsp;
                    </h2>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
