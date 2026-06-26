import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Convert cost values like "$15" into a number.
  const parseCost = (cost) => {
    if (typeof cost === 'number') return cost;
    if (typeof cost !== 'string') return 0;
    const num = Number(cost.replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    return cart.reduce((sum, item) => sum + parseCost(item.cost) * item.quantity, 0);
  };

  const handleContinueShopping = (e) => {
    e.preventDefault();
    onContinueShopping?.();
  };

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    }
  };

  const handleRemove = (item) => {
    if (confirmDelete === item.name) {
      dispatch(removeItem(item.name));
      setConfirmDelete(null);
    } else {
      setConfirmDelete(item.name);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
    return parseCost(item.cost) * item.quantity;
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty. Add some plants first!');
      return;
    }
    setCheckoutError('');
    alert('Thank you for your order! This is a demo, so no actual purchase was made.');
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount()}</h2>

      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty!</p>
          <p>Browse our plants and add some to get started.</p>
        </div>
      ) : (
      <div>
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />

            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>

              <div className="cart-item-quantity">
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>

                <span className="cart-item-quantity-value">{item.quantity}</span>

                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>

              <button
                className={`cart-item-delete ${confirmDelete === item.name ? 'confirm' : ''}`}
                onClick={() => handleRemove(item)}
                aria-label={confirmDelete === item.name ? `Confirm remove ${item.name}` : `Remove ${item.name}`}
              >
                {confirmDelete === item.name ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <button className="get-started-button1" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {checkoutError && <div className="checkout-error" role="alert">{checkoutError}</div>}
    </div>
  );
};

CartItem.propTypes = {
  onContinueShopping: PropTypes.func,
};

export default CartItem;

