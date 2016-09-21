const React = require('react');
require('../dish-menu/cart/cart-ordered-dish.scss');
require('../order/ordered-dish.scss');
require('./dish-detail.scss');

const DishDetail = React.createClass({
  displayName: 'DishDetail',
  propTypes: {
    mainDish: React.PropTypes.object,
  },
  render() {
    const { mainDish } = this.props;
    // console.log('========');
    // console.log(mainDish.subDishItems);
    return (
      <div className="cart-ordered-dish dish-box">
        <div className="ordered-dish">
          <span className="ellipsis dish-name dish-name--trigger is-open">{mainDish.dishName}</span>
          <span className="order-dish-price price">{mainDish.price}</span>
          <span className="order-dish-count">{mainDish.num}</span>
        </div>
        <div className="ordered-dish-dropdown">
        {
          mainDish.subDishItems ?
          mainDish.subDishItems.map((item, index) =>
            <div className="child-dish-info" key={index}>
              <div className="child-dish-head">
                <span className="child-dish-name ellipsis">{item.dishName}</span>
                <span className="dish-num">{item.num}</span>
              </div>
            </div>
          ) : ''
        }
        </div>
      </div>
    );
  },
});

module.exports = DishDetail;

