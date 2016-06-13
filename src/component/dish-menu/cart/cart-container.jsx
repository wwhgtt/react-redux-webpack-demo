const React = require('react');
const TinyCart = require('./tiny-cart.jsx');
const ExpandCart = require('./expand-cart.jsx');
const helper = require('../../../helper/dish-hepler');

require('./cart.scss');

module.exports = React.createClass({
  displayName: 'CartContainer',
  propTypes: {
    dishes: React.PropTypes.array.isRequired,
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
    const { dishes, onBillBtnTap, onOrderBtnTap } = this.props;
    const { expand } = this.state;
    const orderedDishes = helper.getOrderedDishes(dishes);
    return (
      <div className="cart-container">
        <TinyCart
          dishesCount={helper.getDishesCount(orderedDishes)} totalPrice={helper.getDishesPrice(orderedDishes)}
          onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart}
        />
        {expand ?
          <ExpandCart
            dishesCount={helper.getDishesCount(orderedDishes)} totalPrice={helper.getDishesPrice(orderedDishes)}
            orderedDishes={orderedDishes}
            onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart} onOrderBtnTap={onOrderBtnTap}
          /> : false}
      </div>
    );
  },
});
