const React = require('react');
const TinyCart = require('./tiny-cart.jsx');
const helper = require('../../../helper/dish-hepler');

module.exports = React.createClass({
  displayName: 'CartContainer',
  propTypes: {
    dishesData: React.PropTypes.array.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
  },
  expandCart() {
    // TODO
  },
  render() {
    const { dishesData, onBillBtnTap } = this.props;
    const orderedDishesData = helper.getOrderedDishes(dishesData);
    return (
      <div className="cart-container">
        <TinyCart
          dishCount={helper.getDishesCount(orderedDishesData)} totalPrice={helper.getDishesPrice(orderedDishesData)}
          onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart}
        />
      </div>
    );
  },
});
