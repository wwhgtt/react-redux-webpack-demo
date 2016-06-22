const React = require('react');
const _findIndex = require('lodash.findindex');
const helper = require('../../../../helper/dish-hepler');
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
  render() {
    const { dish, remainCount } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dish);
    const count = helper.getDishesCount([dish]);
    const price = helper.getDishPrice(dish);
    return (
      <div className="child-dish">
        <div className="dish-name-wrap">
          <div className="dish-name">
            {dish.name}
            <span className="badge-price">{price}元</span>
            {dish.isReplace ? <span className="badge-bi"></span> : false}
          </div>
          {
            hasProps ?
              <div className="right">
                <span className={classnames({ 'dish-count' : true, 'count-hide' : expand })}>{count}</span>
                <a className="dish-dropdown-trigger btn--ellips" onTouchTap={this.onPropsBtnTap}>{expand ? '收起' : '可选属性'}</a>
              </div>
            :
              <Counter
                count={count}
                maximum={dish.isMulti ? count + remainCount : 1} minimum={dish.isReplace ? dish.leastCellNum : 0}
                onCountChange={this.onCountChange}
              />
          }
        </div>
        {
          expand ?
            <div className="dish-dropdown">
              <div className="counter-container">
                <span className="counter-label">份数：</span>
                <Counter
                  count={count}
                  maximum={dish.isMulti ? count + remainCount : 1} minimum={dish.isReplace ? dish.leastCellNum : 0}
                  onCountChange={this.onCountChange}
                />
              </div>
              <DishPropsSelect
                props={dish.order[0].dishPropertyTypeInfos} ingredients={dish.order[0].dishIngredientInfos}
                onSelectPropsOption={this.onSelectPropsOption}
              />
              <button className="dish-dropdown-close"><span></span></button>
            </div>
            :
            false
        }
      </div>
    );
  },
});
