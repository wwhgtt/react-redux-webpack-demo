const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
const IScroll = require('iscroll/build/iscroll-lite');
const _find = require('lodash.find');
const DynamicClassLI = require('../mui/misc/dynamic-class-hoc.jsx')('li');
const helper = require('../../helper/dish-helper');
require('./dish-type-scroller.scss');

module.exports = React.createClass({
  displayName:'DishTypeScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onDishTypeElementTap: React.PropTypes.func.isRequired,
    theme: React.PropTypes.string,
    dishesDataDuplicate: React.PropTypes.array.isRequired,
  },
  componentDidMount() {
    const iScrollOptions = this.getIScrollOptionsInDiffTheme();

    this._cache = {};
    this._cache.iScroll = new IScroll(findDOMNode(this), iScrollOptions);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.theme === this.props.theme) {
      return;
    }
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
    this.initWrapSize();
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
  getIScrollOptionsInDiffTheme() {
    const defaultOptions = {
      click: true,
      tap: true,
      scrollX: true,
    };

    const getOptions = ({
      big() {
        return { scrollX: true, scrollY: false };
      },
      huge() {
        return { scrollX: true, scrollY: false };
      },
    })[this.props.theme];

    const options = getOptions && getOptions.call(this);
    return Object.assign({}, defaultOptions, options);
  },
  initWrapSize() {
    const { dishTypesData } = this.props;
    if (!dishTypesData.length || this._initWrapSized) {
      return;
    }

    const wrapEl = findDOMNode(this).querySelector('.scroll-wrapper');
    const listEl = wrapEl.querySelector('.dish-type-list');
    const rect = listEl.getBoundingClientRect();
    const _init = ({
      big() {
        wrapEl.style.width = `${rect.width + 10}px`;
      },
      huge() {
        wrapEl.style.width = `${rect.width + 10}px`;
      },
    })[this.props.theme];

    if (_init) {
      _init();
    }
    this._initWrapSized = true;
  },
  buildDishTypeElements(activeDishTypeId, dishTypesData, dishesData, dishesDataDuplicate) {
    const getOrderedCountByType = (dishes, typeId) => {
      const orderedDishesByType = helper.getOrderedDishes(dishes).filter(dish =>
        dish.dishTypeId === typeId
      );
      return helper.getDishesCount(orderedDishesByType) || null;
    };

    return (
      <ul className="dish-type-list">
        {dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          if (dishTypeData.dishIds.length === 1 && _find(dishesData, { id:dishTypeData.dishIds[0] }).currRemainTotal === 0) {
            // 中类下面子菜的数量只有一个且售罄的情况下，中类不显示
            return false;
          }
          return (
            <DynamicClassLI
              key={idx}
              data-id={dishTypeData.id}
              data-count={getOrderedCountByType(dishesDataDuplicate, dishTypeData.id)}
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
    const { activeDishTypeId, dishTypesData, dishesData, dishesDataDuplicate } = this.props;
    const dishTypeElements = this.buildDishTypeElements(activeDishTypeId, dishTypesData, dishesData, dishesDataDuplicate);

    return (
      <div className="dish-type-scroller">
        <div className="scroll-wrapper">
          {dishTypeElements}
        </div>
      </div>
    );
  },
});
