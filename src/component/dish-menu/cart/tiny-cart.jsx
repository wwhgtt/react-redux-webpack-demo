const React = require('react');
const commonHelper = require('../../../helper/common-helper');
const type = commonHelper.getUrlParam('type');

module.exports = React.createClass({
  displayName: 'TinyCart',
  propTypes: {
    dishesCount: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
    totalPrice: React.PropTypes.number,
    takeawayServiceProps: React.PropTypes.object,
    isShopOpen: React.PropTypes.bool.isRequired,
  },
  buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap) {
    const { dishesCount } = this.props;
    if (
      dishesCount > 0 && (!takeawayServiceProps || !takeawayServiceProps.minPrice || totalPrice >= takeawayServiceProps.minPrice)
    ) {
      return (<a className="tiny-cart-btn btn--yellow" onTouchTap={evt => { evt.preventDefault(); onBillBtnTap(); }}>选好啦</a>);
    } else if (dishesCount === 0 && takeawayServiceProps && takeawayServiceProps.minPrice) {
      return <span className="tiny-cart-text">{`${takeawayServiceProps.minPrice} 元起卖`}</span>;
    } else if (dishesCount > 0 && takeawayServiceProps && takeawayServiceProps.minPrice) {
      return <span className="tiny-cart-text">{`还差 ${parseFloat((takeawayServiceProps.minPrice - totalPrice).toFixed(2), 10)} 元起卖`}</span>;
    }
    return false;
  },
  buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps) {
    if (!takeawayServiceProps) {
      return false;
    }
    if (totalPrice < takeawayServiceProps.shipFreePrice && takeawayServiceProps.shipmentFee > 0) {
      return <small>{`另有 ${parseFloat(takeawayServiceProps.shipmentFee, 10)} 元配送费`}</small>;
    }
    return false;
  },
  jumpDetail(num) {
    if (num) {
      location.href = 'http://app.d.cn'; // 跳转到购物车详情页面
    }
  },
  render() {
    const { dishesCount, totalPrice, takeawayServiceProps, onBillBtnTap, onCartIconTap, isShopOpen } = this.props;
    const takeawayServiceMinPriceElement = this.buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap);
    const takeawayServiceShipPriceElement = this.buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps);
    let buttonClass = 'cart-icon cart-icon--tiny cart-icon--fixed';
    if (!dishesCount) {
      buttonClass += ' cart-icon--transparent';
    }
    return (
      <div className={type === 'TS' ? 'tiny-cart-transparent' : 'tiny-cart'}>
        {
          type === 'TS' ?
            <button className={buttonClass} onTouchTap={() => this.jumpDetail(dishesCount)} data-count={dishesCount || null}></button>
          :
            <div className="tiny-cart-left">
              <button className="cart-icon cart-icon--tiny" onTouchTap={evt => onCartIconTap(dishesCount)} data-count={dishesCount || null}></button>
              {
                dishesCount === 0 ? <span className="tiny-cart-text">购物车是空的</span> :
                  <span className="tiny-cart-price price">
                    <strong>{totalPrice}</strong>
                    {takeawayServiceShipPriceElement}
                  </span>
              }
            </div>
        }
        {
          type === 'TS' ?
            false
          :
            <div className="tiny-cart-right">
              {
                isShopOpen ? takeawayServiceMinPriceElement :
                  <span className="tiny-cart-text">商户已打烊</span>
              }
            </div>
        }
      </div>
    );
  },
});
