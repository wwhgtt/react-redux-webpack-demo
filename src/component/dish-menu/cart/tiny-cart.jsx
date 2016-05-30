const React = require('react');

require('./tiny-cart.scss');

module.exports = React.createClass({
  displayName: 'TinyCart',
  propTypes: {
    dishCount: React.PropTypes.number.isRequired,
    totalPrice: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
  },
  render() {
    const { onBillBtnTap, onCartIconTap } = this.props;
    return (
      <div className="tiny-cart">
        <div className="tiny-cart-left">
          <a href="" className="tiny-cart-icon" onTouchTap={onCartIconTap} data-count="3"></a>
          <span className="tiny-cart-price"><strong>28.22</strong><small>另有配送费8元</small></span>
          {/* <span className="tiny-cart-text">购物车是空的</span> */}
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
