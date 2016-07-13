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
    const { dishesCount, totalPrice, takeawayServiceProps,
      onBillBtnTap, onOrderBtnTap, onCartIconTap, orderedDishes, onClearBtnTap } = this.props;
    const orderedElements = this.buildOrderedElements(orderedDishes, onOrderBtnTap);
    const takeawayServiceMinPriceElement = this.buildTakeawayServiceMinPriceElement(totalPrice, takeawayServiceProps, onBillBtnTap);
    const takeawayServiceShipPriceElement = this.buildTakeawayServiceShipPriceElement(totalPrice, takeawayServiceProps);
    return (
      <div className="expand-cart">
        <div className="expand-cart-close" onTouchTap={onCartIconTap}></div>

        <div className="expand-cart-main">
          <div className="expand-cart-header">
            <a className="cart-icon cart-icon--expand" onTouchTap={onCartIconTap} data-count={dishesCount}></a>
            <a className="expand-cart-clear" onTouchTap={onClearBtnTap}>清空购物车</a>
          </div>

          {orderedElements}

          <div className="tiny-cart">
            <div className="tiny-cart-left">
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
        </div>
      </div>
    );
  },
});
