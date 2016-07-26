const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
const IScroll = require('iscroll/build/iscroll-lite');
const _find = require('lodash.find');
const DynamicClassLI = require('../mui/misc/dynamic-class-hoc.jsx')('li');
const helper = require('../../helper/dish-hepler');
require('./dish-type-scroller.scss');

module.exports = React.createClass({
  displayName:'DishTypeScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onDishTypeElementTap: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    this._cache = {};
    this._cache.iScroll = new IScroll(findDOMNode(this), {});
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate() {
    const iScroll = this._cache.iScroll;
    iScroll.refresh();
    const activeDishType = findDOMNode(this).querySelector('.is-active');
    if (activeDishType) {
      iScroll.scrollToElement(activeDishType, 300);
    }
  },
  componentWillUnmount() {
    this._cache.iScroll.destroy();
    this._cache = null;
  },
  onDishTypeElementTap(evt) {
    const { onDishTypeElementTap } = this.props;
    const dishTypeId = parseInt(evt.target.getAttribute('data-id'), 10);
    onDishTypeElementTap(evt, dishTypeId);
  },
  buildDishTypeElements(activeDishTypeId, dishTypesData, dishesData) {
    const getOrderedCountByType = (dishes, dishIds) => {
      const orderedDishesByType = helper.getOrderedDishes(dishes).filter(dish =>
        dishIds.indexOf(dish.id) > -1
      );

      return helper.getDishesCount(orderedDishesByType) || null;
    };

    return (
      <ul className="dish-type-list">
        {dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          if (dishTypeData.dishIds.length === 1 && _find(dishesData, { id:dishTypeData.dishIds[0] }).clearStatus !== 1) {
            // 需要考虑length为1  且菜品信息clearStatus不为1的情况
            return false;
          }
          return (
            <DynamicClassLI
              key={idx}
              data-id={dishTypeData.id}
              data-count={getOrderedCountByType(dishesData, dishTypeData.dishIds)}
              isActive={activeDishTypeId === dishTypeData.id}
              className="dish-type-item"
              onTouchTap={this.onDishTypeElementTap}
            >
              <span>{dishTypeData.name}</span>
            </DynamicClassLI>
          );
        })}
      </ul>
    );
  },
  render() {
    const { activeDishTypeId, dishTypesData, dishesData } = this.props;

    const dishTypeElements = this.buildDishTypeElements(activeDishTypeId, dishTypesData, dishesData);

    return (
      <div className="dish-type-scroller">
        <div className="scroll-wrapper">
          {dishTypeElements}
        </div>
      </div>
    );
  },
});
