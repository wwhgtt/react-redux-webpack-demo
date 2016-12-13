const React = require('react');
const _findIndex = require('lodash.findindex');
const helper = require('../../../../helper/dish-helper');
const Counter = require('../../../mui/counter.jsx');
const DishPropsSelect = require('../dish-props-select.jsx');
window.I = require('seamless-immutable');
const classnames = require('classnames');
require('./child-dish.scss');

module.exports = React.createClass({
  displayName: 'GroupDishDetailChildDish',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    remainCount: React.PropTypes.number.isRequired,
    onDishChange: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  onCountChange(newCount, increment) {
    const { dish, onDishChange } = this.props;
    const oldCount = helper.getDishesCount([dish]);

    if (oldCount === 0) {
      newCount = dish.leastCellNum;
    } else if (oldCount + increment < dish.leastCellNum) {
      newCount = 0;
    } else {
      newCount = oldCount + increment;
    }

    onDishChange(dish.update(
      'order',
      order => helper.isSingleDishWithoutProps(dish) ? newCount : order.setIn([0, 'count'], newCount)
    ));
  },
  onSelectPropsOption(propData, optionData) {
    const { dish, onDishChange } = this.props;
    let propIdx = -1;
    switch (propData.type) {
      case 1:
        propIdx = _findIndex(
          dish.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        onDishChange(
          dish.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              } else if (option.id !== optionData.id && option.isChecked === true) {
                return option.set('isChecked', false);
              }
              return option;
            })
          ),
        );
        break;
      case 3:
        propIdx = _findIndex(
          dish.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        onDishChange(
          dish.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        );
        break;
      case -1: // this is a client workround for ingredientsData, we don't have this value of type on serverside
        onDishChange(
          dish.updateIn(
            ['order', 0, 'dishIngredientInfos'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        );
        break;
      default:
    }
  },
  onPropsBtnTap(evt) {
    this.setState({ expand:!this.state.expand });
  },
  buildDishCounter(args) {
    const { dish, count, remainCount } = args;
    const leastCellNum = Math.max(dish.leastCellNum, 1);
    let maximum = count + remainCount;
    let minimum = 0;
    // 必选
    if (dish.isReplace) {
      minimum = leastCellNum;
      if (!dish.isMulti) {
        maximum = minimum;
      }
    } else {
      minimum = 0;
      if (dish.isMulti) {
        if (maximum < leastCellNum) {
          maximum = 0;
        }
      } else {
        maximum = leastCellNum > maximum ? 0 : leastCellNum;
      }
    }

    if (maximum < minimum) {
      maximum = minimum = 0;
    }
    return (
      <Counter
        count={count}
        maximum={maximum} minimum={minimum}
        onCountChange={this.onCountChange}
      />
    );
  },
  buildOrderBtn(dish, hasProps, remainCount, count) {
    const { expand } = this.state;
    if (dish.clearStatus) {
      return (<span className="dish-item-soldout">已售罄</span>);
    }
    if (hasProps) {
      return (
        <div className="right">
          <span className={classnames({ 'dish-count' : true, 'count-hide' : expand || count <= 0 })}>{count}</span>
          <a className="dish-dropdown-trigger btn--ellips" onTouchTap={this.onPropsBtnTap}>{expand ? '收起' : '商品选项'}</a>
        </div>
      );
    }
    return this.buildDishCounter({ dish, remainCount, count });
  },
  render() {
    const { dish, remainCount } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dish);
    const count = helper.getDishesCount([dish]);
    // const price = helper.getDishPrice(dish);
    const marketPrice = dish.marketPrice || 0;
    return (
      <div className="child-dish">
        <div className="dish-name-wrap">
          <div className="dish-name">
            {helper.generateDishNameWithUnit(dish)}
            {marketPrice !== 0 ? <span className="badge-price">{marketPrice > 0 ? '+' : ''}{marketPrice}元</span> : false}
            {dish.isReplace ? <span className="badge-bi"></span> : false}
          </div>
          {this.buildOrderBtn(dish, hasProps, remainCount, count)}
        </div>
        {
          expand ?
            <div className="dish-dropdown">
              <div className="counter-container">
                <span className="counter-label">份数：</span>
                {this.buildDishCounter({ dish, remainCount, count })}
              </div>
              <DishPropsSelect
                dish={dish}
                onSelectPropsOption={this.onSelectPropsOption}
              />
              <button className="dish-dropdown-close" onTouchTap={this.onPropsBtnTap}><span></span></button>
            </div>
            :
            false
        }
      </div>
    );
  },
});
