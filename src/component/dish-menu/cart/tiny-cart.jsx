const React = require('react');

module.exports = React.createClass({
  displayName: 'TinyCart',
  propTypes: {
    dishesCount: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
    totalPrice: React.PropTypes.number,
    takeawayServiceProps: React.PropTypes.object,
  },
  buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap) {
    if (
      totalPrice > 0 && (!takeawayServiceProps || !takeawayServiceProps.minPrice || totalPrice >= takeawayServiceProps.minPrice)
    ) {
      return (<a className="tiny-cart-btn btn--yellow" onTouchTap={onBillBtnTap}>选好啦</a>);
    } else if (totalPrice === 0 && takeawayServiceProps && takeawayServiceProps.minPrice) {
      return <span className="tiny-cart-text">{`${takeawayServiceProps.minPrice} 元起卖`}</span>;
    } else if (totalPrice > 0 && takeawayServiceProps && takeawayServiceProps.minPrice) {
      return <span className="tiny-cart-text">{`还差 ${takeawayServiceProps.minPrice - totalPrice} 元起卖`}</span>;
    }
    return false;
  },
  buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps) {
    if (!takeawayServiceProps || !takeawayServiceProps.shipmentFee) {
      return false;
    }
    if (totalPrice < takeawayServiceProps.shipFreePrice) {
      return <small>{`另有 ${takeawayServiceProps.shipmentFee} 元配送费`}</small>;
    }
    return false;
  },
  render() {
    const { dishesCount, totalPrice, takeawayServiceProps, onBillBtnTap, onCartIconTap } = this.props;
    const takeawayServiceMinPriceElement = this.buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap);
    const takeawayServiceShipPriceElement = this.buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps);
    return (
      <div className="tiny-cart">
        <div className="tiny-cart-left">
          <a className="cart-icon cart-icon--tiny" onTouchTap={onCartIconTap} data-count={dishesCount}></a>
          {
            dishesCount === 0 ? <span className="tiny-cart-text">购物车是空的</span> :
              <span className="tiny-cart-price price">
                <strong>{totalPrice}</strong>
                {takeawayServiceShipPriceElement}
              </span>
          }
        </div>
        <div className="tiny-cart-right">
          {/* <span className="tiny-cart-text">商户已打烊</span> */}
          {takeawayServiceMinPriceElement}
        </div>
      </div>
    );
  },
});
