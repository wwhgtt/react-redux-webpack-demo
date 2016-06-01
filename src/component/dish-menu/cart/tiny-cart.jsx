const React = require('react');

module.exports = React.createClass({
  displayName: 'TinyCart',
  propTypes: {
    dishCount: React.PropTypes.number.isRequired,
    totalPrice: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
  },
  render() {
    const { dishCount, totalPrice, onBillBtnTap, onCartIconTap } = this.props;
    return (
      <div className="tiny-cart">
        <div className="tiny-cart-left">
          <a className="cart-icon cart-icon--tiny" onTouchTap={onCartIconTap} data-count={dishCount}></a>
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
    );
  },
});
