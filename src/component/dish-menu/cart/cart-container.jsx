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
    onClearBtnTap: React.PropTypes.func.isRequired,
    takeawayServiceProps: React.PropTypes.object,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  expandCart(evt) {
    this.setState({ expand: !this.state.expand });
    evt.preventDefault();
  },
  render() {
    const { dishes, takeawayServiceProps, onBillBtnTap, onOrderBtnTap, onClearBtnTap } = this.props;
    const { expand } = this.state;
    const orderedDishes = helper.getOrderedDishes(dishes);
    return (
      <div className="cart-container">
        <TinyCart
          dishesCount={helper.getDishesCount(orderedDishes)}
          totalPrice={helper.getDishesPrice(orderedDishes)}
          takeawayServiceProps={takeawayServiceProps}
          onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart}
        />
        {expand ?
          <ExpandCart
            dishesCount={helper.getDishesCount(orderedDishes)} totalPrice={helper.getDishesPrice(orderedDishes)}
            orderedDishes={orderedDishes} takeawayServiceProps={takeawayServiceProps}
            onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart} onOrderBtnTap={onOrderBtnTap} onClearBtnTap={onClearBtnTap}
          /> : false}
      </div>
    );
  },
});
