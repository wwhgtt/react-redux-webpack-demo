const React = require('react');
const TinyCart = require('./tiny-cart.jsx');
const ExpandCart = require('./expand-cart.jsx');
const helper = require('../../../helper/dish-hepler');

require('./cart.scss');

module.exports = React.createClass({
  displayName: 'CartContainer',
  propTypes: {
    dishesData: React.PropTypes.array.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  expandCart() {
    this.setState({ expand: !this.state.expand });
  },
  render() {
    const { dishesData, onBillBtnTap, onOrderBtnTap } = this.props;
    const { expand } = this.state;
    const orderedDishesData = helper.getOrderedDishes(dishesData);
    return (
      <div className="cart-container">
        <TinyCart
          dishCount={helper.getDishesCount(orderedDishesData)} totalPrice={helper.getDishesPrice(orderedDishesData)}
          onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart}
        />
        {expand ?
          <ExpandCart
            dishCount={helper.getDishesCount(orderedDishesData)} totalPrice={helper.getDishesPrice(orderedDishesData)}
            orderedDishesData={orderedDishesData}
            onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart} onOrderBtnTap={onOrderBtnTap}
          /> : false}
      </div>
    );
  },
});
