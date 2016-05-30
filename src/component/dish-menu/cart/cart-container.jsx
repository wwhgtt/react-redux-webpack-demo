const React = require('react');
const TinyCart = require('./tiny-cart.jsx');

module.exports = React.createClass({
  displayName: 'CartContainer',
  propTypes: {
    dishesData: React.PropTypes.array.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
  },
  getDishCount(dishesData) {
    return dishesData.
      filter(dishData => dishData.hasOwnProperty('order')).
      map(dishData => typeof(dishData.order) === 'number' ? dishData.order : dishData.order.length).
      reducer();
  },
  expandCart() {
    // TODO
  },
  render() {
    const { onBillBtnTap } = this.props;
    return (
      <div className="cart-container">
        <TinyCart dishCount={6} totalPrice={98.00} onBillBtnTap={onBillBtnTap} onCartIconTap={this.expandCart} />
      </div>
    );
  },
});
