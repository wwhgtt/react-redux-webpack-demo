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
  componentDidUpdate() {
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
    if (dishData.clearStatus !== 1) {
      // 表示没有被沽清
      return (<span className="dish-item-soldout">已售罄</span>);
    }
    if (helper.isSingleDishWithoutProps(dishData)) {
      return (<Counter count={dishData.order} onCountChange={this.onBtnTap} step={dishData.stepNum} />);
    }

    // 使用onClick时在手机端没能起作用  所以使用onTouchTap
    const count = helper.getDishesCount([dishData]);
    const title = Array.isArray(dishData.groups) ? '套餐选项' : '菜品选项';
    return (
      <div className="counter">
        {count > 0 ? <span className="counter-num">{count}</span> : false}
        <a className="btn--ellips btn-choose-property" onTouchTap={this.onBtnTap}>{title}</a>
      </div>
    );
  },
  buildDishName(dishData) {
    if (helper.isSingleDishWithoutProps(dishData) && Array.isArray(dishData.dishPropertyTypeInfos) && dishData.dishPropertyTypeInfos.length) {
      const properties = dishData.dishPropertyTypeInfos.map(prop => prop.properties[0].name).join(', ');
      return `${dishData.name} ${properties}/${dishData.unitName}`;
    }
    return dishData.name;
  },
  render() {
    const { dishData } = this.props;
    const orderBtn = this.buildOrderBtn(dishData);
    return (
      <div className="dish-on-selling">
        {dishData.currRemainTotal !== 0 ?
          <div className="dish-list-item">
            <button
              className={classnames('dish-item-img', { 'is-memberdish': dishData.isMember })}
              onTouchTap={this.onDishImageTap}
              style={{ backgroundImage: `url(${dishData.smallImgUrl || imagePlaceholder})` }}
            ></button>

            <div className="dish-item-content">
              <span className="dish-item-name ellipsis">{helper.generateDishNameWithUnit(dishData)}</span>
              <span className="dish-item-price price">{dishData.marketPrice}</span>
              {orderBtn}
            </div>
          </div>
          :
          false
        }
      </div>
    );
  },
});
