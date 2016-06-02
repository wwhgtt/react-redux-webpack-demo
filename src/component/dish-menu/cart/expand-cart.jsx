const React = require('react');
const CartOrderedItem = require('./cart-ordered-item.jsx');
const helper = require('../../../helper/dish-hepler');
require('./expand-cart.scss');

module.exports = React.createClass({
  displayName: 'ExpandCart',
  propTypes: {
    dishCount: React.PropTypes.number.isRequired,
    totalPrice: React.PropTypes.number.isRequired,
    onBillBtnTap: React.PropTypes.func.isRequired,
    onCartIconTap: React.PropTypes.func.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    orderedDishesData: React.PropTypes.array,
  },
  buildOrderedList(orderedDishesData, onOrderBtnTap) {
    function divideDishes(dishesData) {
      return [].concat.apply(
        [], dishesData.map(dishData => {
          if (helper.isSingleDishWithoutProps(dishData)) {
            return [dishData];
          }
          return dishData.order.map((dishOrderData, idx) =>
            Object.assign({}, dishData,
              { key:`${dishData.id}-${idx}` },
              { order:[Object.assign({}, dishOrderData)] }
            )
          );
        })
      );
    }
    const dividedDishesData = divideDishes(orderedDishesData);
    return (
      <div className="cart-ordered-list">
      {
        dividedDishesData.map(dishData => (<CartOrderedItem key={dishData.key} dishData={dishData} onOrderBtnTap={onOrderBtnTap} />))
      }
      </div>
    );
  },
  render() {
    const { dishCount, totalPrice, onBillBtnTap, onOrderBtnTap,
      onCartIconTap, orderedDishesData } = this.props;
    const cartOrderedList = this.buildOrderedList(orderedDishesData, onOrderBtnTap);
    return (
      <div className="expand-cart">
        <div className="expand-cart-close"></div>

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
              <a className="tiny-cart-btn btn--yellow" onTouchTap={onBillBtnTap}>选好啦</a>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
