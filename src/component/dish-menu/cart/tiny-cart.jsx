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
    const { onBillBtnTap, onCartIconTap } = this.props;
    return (
      <div className="tiny-cart">
        <a href="" className="cart-icon" onTouchTap={onCartIconTap}></a>
        <span className="total-price">28</span>
        <a href="" className="bill-btn" onTouchTap={onBillBtnTap}>选好啦</a>
      </div>
    );
  },
});
