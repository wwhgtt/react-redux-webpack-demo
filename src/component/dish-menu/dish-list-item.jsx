const React = require('react');
const classnames = require('classnames');
const Counter = require('../mui/counter.jsx');
const shallowCompare = require('react-addons-shallow-compare');
const helper = require('../../helper/dish-hepler');
const imagePlaceholder = require('../../asset/images/dish-placeholder.png');
const _find = require('lodash.find');
require('./dish-list-item.scss');

module.exports = React.createClass({
  displayName:'DishListItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    dishesDataDuplicate: React.PropTypes.array.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onPropsBtnTap: React.PropTypes.func.isRequired,
    onImageBtnTap: React.PropTypes.func.isRequired,
    diningForm: React.PropTypes.bool,
    marketList: React.PropTypes.object,
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
  buildOrderBtn(dishData, dishesDataDuplicate) {
    if (dishData.clearStatus !== 1) {
      // 表示没有被沽清
      return (<span className="dish-item-soldout">已售罄</span>);
    }
    let dishCopy = _find(dishesDataDuplicate, dishDataCopy => dishDataCopy.id === dishData.id);
    if (helper.isSingleDishWithoutProps(dishData)) {
      return (<Counter count={dishCopy.order} onCountChange={this.onBtnTap} step={dishData.stepNum} />);
    }

    // 使用onClick时在手机端没能起作用  所以使用onTouchTap
    const count = dishData.sameRuleDishes && dishData.sameRuleDishes.length ?
      helper.getDishesCount([dishCopy]) + helper.ruleDishesCount(dishData, dishesDataDuplicate)
      :
      helper.getDishesCount([dishCopy]);
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
  disCountInfo(diningForm, marketList, dishId) {
    if (diningForm && marketList[dishId] && marketList[dishId].length !== 0 && marketList[dishId][0].isAble) {
      let vip = '';
      switch (marketList[dishId][0].customerType) {
        case 1 : vip = '(会员 '; break;
        case 2 : vip = '(非会员 '; break;
        default: vip = '('; break;
      }
      return (
        <span className="dish-item-discount ellipsis">
          {
            marketList[dishId][0].dishNum > 1 ?
              `满${marketList[dishId][0].dishNum}份${marketList[dishId][0].ruleName}`
            :
              marketList[dishId][0].ruleName
          }
          {vip}每单限{marketList[dishId][0].dishNum}份)
        </span>);
    }
    return (<span className="dish-item-discount ellipsis"></span>);
  },
  render() {
    const { dishData, marketList, diningForm, dishesDataDuplicate } = this.props;
    const orderBtn = this.buildOrderBtn(dishData, dishesDataDuplicate);
    const discountPart = this.disCountInfo(diningForm, marketList, dishData.brandDishId);
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
              {discountPart}
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
