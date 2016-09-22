const React = require('react');
const classnames = require('classnames');
require('../dish-menu/cart/cart-ordered-dish.scss');
require('../order/ordered-dish.scss');
require('./dish-detail.scss');

const DishDetail = React.createClass({
  displayName: 'DishDetail',
  propTypes: {
    mainDish: React.PropTypes.object,
  },
  getInitialState() {
    return {
      expand : false, // 是否展开
      hasChild: true, // 是否有子项
    };
  },
  componentWillReceiveProps(nextProps) {
    const { mainDish } = nextProps;
    if (mainDish.memo || mainDish.subDishItems) {
      this.setState({ hasChild: true });
    }
  },
  handleExpand() {
    this.setState({ expand:!this.state.expand });
  },
  render() {
    const { mainDish } = this.props;
    const { expand, hasChild } = this.state;
    return (
      <div className="cart-ordered-dish dish-box">
        <div className="ordered-dish">
          <a
            className={classnames('ellipsis dish-name', { 'dish-name--trigger': hasChild }, { 'is-open': expand })}
            onTouchTap={this.handleExpand}
          >{mainDish.dishName}</a>
          <span className="order-dish-price price">{mainDish.price}</span>
          <span className="order-dish-count">{mainDish.num}</span>
        </div>
        {
          expand ?
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
          : ''
        }
      </div>
    );
  },
});

module.exports = DishDetail;

