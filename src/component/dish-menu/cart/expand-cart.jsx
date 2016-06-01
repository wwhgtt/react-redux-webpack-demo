const React = require('react');

require('./expand-cart.scss');

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
        <div className="expand-cart-main">
          <div className="expand-cart-header">
            <a href="" className="cart-icon cart-icon--expand" onTouchTap={onCartIconTap} data-count={dishCount}></a>
            <a className="expand-cart-clear">清空购物车</a>
          </div>

          {cartOrderedList}

          <div className="tiny-cart">
            <div className="tiny-cart-left">
              {
                dishCount === 0 ? <span className="tiny-cart-text">购物车是空的</span> :
                <span className="tiny-cart-price price"><strong>{totalPrice}</strong><small>另有配送费8元</small></span>
              }
            </div>
            <div className="tiny-cart-right">
              {/* <span className="tiny-cart-text">商户已打烊</span> */}
              {/* <span className="tiny-cart-text">差5元起送</span> */}
              <a href="" className="tiny-cart-btn btn--yellow" onTouchTap={onBillBtnTap}>选好啦</a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
