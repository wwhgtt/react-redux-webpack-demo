const React = require('react');
const Counter = require('../mui/counter.jsx');
const shallowCompare = require('react-addons-shallow-compare');
const helper = require('../../helper/dish-hepler');

require('./dish-list-item.scss');

module.exports = React.createClass({
  displayName:'DishListItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onPropsBtnTap: React.PropTypes.func.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  onBtnTap(newCount, increment) {
    const { dishData, onOrderBtnTap, onPropsBtnTap } = this.props;
    if (increment) {
      onOrderBtnTap(dishData, increment);
    } else {
      onPropsBtnTap(dishData);
    }
  },
  buildOrderBtn(dishData) {
    if (helper.isSingleDishWithoutProps(dishData)) {
      return (<Counter count={dishData.order} onCountChange={this.onBtnTap} step={dishData.stepNum} />);
    }
    return (<a className="btn--ellips btn-choose-property" onTouchTap={this.onBtnTap}>菜品选项</a>);
  },
  render() {
    const { dishData } = this.props;
    const orderBtn = this.buildOrderBtn(dishData);
    return (
      <div className="dish-list-item">
        <a href="" className="dish-item-img">{dishData.img}</a>
        <div className="dish-item-content">
          <span className="dish-item-name">{dishData.name}</span>
          <span className="dish-item-price price">{dishData.marketPrice}</span>
          {orderBtn}
        </div>
      </div>
    );
  },
});
