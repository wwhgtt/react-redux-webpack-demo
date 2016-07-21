const React = require('react');
const classnames = require('classnames');
const Counter = require('../mui/counter.jsx');
const shallowCompare = require('react-addons-shallow-compare');
const helper = require('../../helper/dish-hepler');
const imagePlaceholder = require('../../asset/images/dish-placeholder.png');

require('./dish-list-item.scss');

module.exports = React.createClass({
  displayName:'DishListItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onPropsBtnTap: React.PropTypes.func.isRequired,
    onImageBtnTap: React.PropTypes.func.isRequired,
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
  onDishImageTap() {
    const { dishData, onImageBtnTap } = this.props;
    onImageBtnTap(dishData);
  },
  buildOrderBtn(dishData) {
    if (helper.isSingleDishWithoutProps(dishData)) {
      return (<Counter count={dishData.order} onCountChange={this.onBtnTap} step={dishData.stepNum} />);
    }
    // 使用onClick时在手机端没能起作用  所以使用onTouchTap
    return (<a className="btn--ellips btn-choose-property" onTouchTap={this.onBtnTap}>菜品选项</a>);
  },
  render() {
    const { dishData } = this.props;
    const orderBtn = this.buildOrderBtn(dishData);
    return (
      <div className="dish-list-item">
        <button
          className={classnames('dish-item-img', { 'is-memberdish': dishData.isMember })}
          onTouchTap={this.onDishImageTap}
          style={{ backgroundImage: `url(${dishData.smallImgUrl || imagePlaceholder})` }}
        ></button>

        <div className="dish-item-content">
          <span className="dish-item-name ellipsis">{dishData.name}</span>
          <span className="dish-item-price price">{dishData.marketPrice}</span>
          {orderBtn}
        </div>
      </div>
    );
  },
});
