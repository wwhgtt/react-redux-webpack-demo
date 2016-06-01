const React = require('react');

module.exports = React.createClass({
  displayName: 'ExpandCart',
  propTypes: {
    dishCount: React.PropTypes.number.isRequired,
    totalPrice: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
    orderedDishesData: React.PropTypes.array,
  },
  buildCartOrderedList(orderedDishesData) {
    return (
      <div className="cart-ordered-list">
      </div>
    );
  },
  render() {
    const { dishCount, totalPrice, onBillBtnTap, onCartIconTap, orderedDishesData } = this.props;
    const cartOrderedList = this.buildCartOrderedList(orderedDishesData);
    return (
      <div className="expand-cart">
        <div className="headbar">
          <a href="" className="cart-icon" onTouchTap={onCartIconTap} data-count={dishCount}></a>
          <a className="clear-cart-btn"></a>
        </div>
        {cartOrderedList}
        <div className="bottombar">
          {
            dishCount === 0 ? <span className="cart-text">购物车是空的</span> :
              <span className="cart-price price"><strong>{totalPrice}</strong><small>另有配送费8元</small></span>
          }
          <a href="" className="tiny-cart-btn btn--yellow" onTouchTap={onBillBtnTap}>选好啦</a>
        </div>
      </div>
    );
  },
});
