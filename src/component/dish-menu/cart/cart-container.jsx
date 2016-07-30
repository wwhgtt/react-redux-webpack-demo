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
    openTimeList: React.PropTypes.array,
    isAcceptTakeaway: React.PropTypes.bool,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  onClearBtnTap() {
    const { onClearBtnTap } = this.props;
    this.setState({ expand: !this.state.expand });
    onClearBtnTap();
  },
  expandCart(count) {
    if (count > 0) {
      this.setState({ expand: !this.state.expand });
    }
  },
  render() {
    const { dishes, takeawayServiceProps, onBillBtnTap, onOrderBtnTap, openTimeList, isAcceptTakeaway } = this.props;
    const { expand } = this.state;
    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes);
    let isShopOpen;

    if (helper.getUrlParam('type') === 'WM' && isAcceptTakeaway) {
      isShopOpen = true;
    } else {
      isShopOpen = helper.isShopOpen(openTimeList);
    }

    return (
      <div className="cart-container">
        <TinyCart
          dishesCount={dishesCount}
          totalPrice={helper.getDishesPrice(orderedDishes)}
          takeawayServiceProps={takeawayServiceProps}
          isShopOpen={isShopOpen}
          onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart}
        />
        {expand && dishesCount > 0 ?
          <ExpandCart
            dishesCount={dishesCount} totalPrice={helper.getDishesPrice(orderedDishes)}
            orderedDishes={orderedDishes} takeawayServiceProps={takeawayServiceProps}
            isShopOpen={isShopOpen}
            onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart} onOrderBtnTap={onOrderBtnTap} onClearBtnTap={this.onClearBtnTap}
          /> : false}
      </div>
    );
  },
});
