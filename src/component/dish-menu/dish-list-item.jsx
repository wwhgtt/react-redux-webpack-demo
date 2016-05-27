const React = require('react');
const Counter = require('../mui/counter.jsx');
const helper = require('../../helper/dish-hepler');

require('./dish-list-item.scss');

module.exports = React.createClass({
  displayName:'DishListItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
  },
  onOrderBtnTap(action) {
    const { dishData, onOrderBtnTap } = this.props;
    onOrderBtnTap(dishData, action);
  },
  buildOrderBtn(dishData) {
    if (helper.isSingleDishWithoutProps(dishData)) {
      return (<Counter count={dishData.order} onCountChange={this.onOrderBtnTap} />);
    }
    return (<a href="" className="choose-property-btn" onTouchTap={this.onOrderBtnTap}></a>);
  },
  render() {
    const { dishData } = this.props;
    const orderBtn = this.buildOrderBtn(dishData);
    return (
      <div className="dish-list-item">
        <a href="" className="dish-item-img">{dishData.img}</a>
        <div className="dish-item-content">
          <span className="dish-item-name">{dishData.name}</span>
          <span className="dish-item-price">{dishData.marketPrice}</span>
          {orderBtn}
        </div>
      </div>
    );
  },
});
