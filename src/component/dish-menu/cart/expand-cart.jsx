const React = require('react');
const CartOrderedDish = require('./cart-ordered-dish.jsx');
const helper = require('../../../helper/dish-hepler');
require('./expand-cart.scss');

module.exports = React.createClass({
  displayName: 'ExpandCart',
  propTypes: {
    dishesCount: React.PropTypes.number.isRequired,
    totalPrice: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onClearBtnTap: React.PropTypes.func.isRequired,
    orderedDishes: React.PropTypes.array,
    takeawayServiceProps: React.PropTypes.object,
    isShopOpen: React.PropTypes.bool.isRequired,
  },
  buildOrderedElements(orderedDishes, onOrderBtnTap) {
    function divideDishes(dishes) {
      return [].concat.apply(
        [], dishes.map(dish => {
          if (helper.isSingleDishWithoutProps(dish)) {
            return [Object.assign({}, dish,
              { key:`${dish.id}` },
            )];
          }
          return dish.order.map((dishOrder, idx) =>
            Object.assign({}, dish,
              { key:`${dish.id}-${idx}` },
              { order:[Object.assign({}, dishOrder)] }
            )
          );
        })
      );
    }
    const dividedDishes = divideDishes(orderedDishes);
    return (
      <div className="cart-ordered-list">
      {
        dividedDishes.map(dish => (<CartOrderedDish key={dish.key} dish={dish} onOrderBtnTap={onOrderBtnTap} />))
      }
      </div>
    );
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
  render() {
    const { dishesCount, totalPrice, takeawayServiceProps,
      onBillBtnTap, onOrderBtnTap, onCartIconTap, orderedDishes, onClearBtnTap, isShopOpen } = this.props;
    const orderedElements = this.buildOrderedElements(orderedDishes, onOrderBtnTap);
    const takeawayServiceMinPriceElement = this.buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap);
    const takeawayServiceShipPriceElement = this.buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps);
    return (
      <div className="expand-cart">
        <div className="expand-cart-close" onTouchTap={evt => onCartIconTap(dishesCount)}></div>

        <div className="expand-cart-main">
          <div className="expand-cart-header">
            <strong className="expand-cart-title">购物车</strong>
            <button className="expand-cart-clear" onTouchTap={onClearBtnTap}>清空购物车</button>
          </div>

          {orderedElements}

          <div className="tiny-cart">
            <div className="tiny-cart-left">
              <button className="cart-icon cart-icon--expand" onTouchTap={evt => onCartIconTap(dishesCount)} data-count={dishesCount}></button>
              {
                dishesCount === 0 ? <span className="tiny-cart-text">购物车是空的</span> :
                  <span className="tiny-cart-price price">
                    <strong>{totalPrice}</strong>
                    {takeawayServiceShipPriceElement}
                  </span>
              }
            </div>
            <div className="tiny-cart-right">
              {
                isShopOpen ? takeawayServiceMinPriceElement :
                  <span className="tiny-cart-text">商户已打烊</span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
});
