const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
const _find = require('lodash.find');
const IScroll = require('iscroll/build/iscroll-lite');
const classnames = require('classnames');
const DishListItem = require('./dish-list-item.jsx');

require('./dish-scroller.scss');

module.exports = React.createClass({
  displayName: 'DishScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onScroll: React.PropTypes.func.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
    onPropsBtnTap: React.PropTypes.func.isRequired,
    onImageBtnTap: React.PropTypes.func.isRequired,
  },
  componentWillMount() {
  },
  componentDidMount() {
    const { onScroll } = this.props;
    const cache = this._cache = {};
    const iScroll = cache.iScroll = new IScroll(findDOMNode(this), {});
    iScroll.on('scrollStart', () => {
      cache.isScrolling = true;
      if (cache.timer) {
        window.clearTimeout(cache.timer);
        cache.timer = null;
      }
    });
    iScroll.on('scrollEnd', () => {
      const dishTypeId = this.findCurrentDishTypeId(iScroll.y);
      if (!window.__activeTypeByTap__ && dishTypeId) {
        if (cache.timer) {
          window.clearTimeout(cache.timer);
        }
        cache.timer = setTimeout(() => onScroll(null, dishTypeId), 150);
      }
      cache.isScrolling = false;
      window.__activeTypeByTap__ = false;
    });
  },
  shouldComponentUpdate(nextProps, nextState) {
    const cache = this._cache;
    return !cache.isScrolling && shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate() {
    const cache = this._cache;
    const iScroll = cache.iScroll;
    iScroll.refresh();
    const activeDishType = findDOMNode(this).querySelector('.active');
    if (window.__activeTypeByTap__) { // if update is not caused by scrolling or touching in dish-scroller.
      iScroll.scrollToElement(activeDishType, 300);             // that mean it's caused by activeDishType, so scrollTo the according dish type
    }
  },
  componentWillUnmount() {
    this._cache.iScroll.destroy();
    this._cache = null;
  },
  onDishBtnTap(dishData, action) {
    const { onOrderBtnTap, onPropsBtnTap } = this.props;
    // this._cache.isTaping = true;
    if (action) {
      onOrderBtnTap(dishData, action);
    } else {
      onPropsBtnTap(dishData);
    }
    // setTimeout(() => this._cache.isTaping = false, 0); // set isTaping to false at nextTick of rendering;
  },
  findCurrentDishTypeId(posY) {
    const dishTypes = findDOMNode(this).querySelectorAll('.dish-item-type');
    const showingDishTypes = Array.prototype.slice.call(dishTypes).filter(dishType => dishType.offsetTop < -posY + 5);
    if (showingDishTypes.length) {
      return parseInt(showingDishTypes.pop().getAttribute('data-id'), 10);
    }
    return false;
  },
  buildDishElements(activeDishTypeId, dishTypesData, dishesData, onDishBtnTap) {
    function getDishById(dishId) {
      const dish = _find(dishesData, { id:dishId });
      if (!dish) {
        throw new Error(`Can not find dish for dishId ${dishId}, check the dishTypesData.`);
      }
      return dish;
    }
    return (
      <ul className="dish-list">
      {
        dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          return (
            [
              <li
                key={`dish-type-${dishTypeData.id}`}
                data-id={dishTypeData.id}
                className={classnames('dish-item-type', { active:activeDishTypeId === dishTypeData.id })}
              >
                {dishTypeData.desc ? dishTypeData.name + ' (' + dishTypeData.desc + ')' : dishTypeData.name}
              </li>,
            ].concat(
              dishTypeData.dishIds.map(dishId => {
                const dishData = getDishById(dishId);
                return (<li className="dish-item-dish"><DishListItem
                  dishData={dishData} onOrderBtnTap={onDishBtnTap} onPropsBtnTap={onDishBtnTap} onImageBtnTap={this.props.onImageBtnTap}
                /></li>
                );
              })
            )
          );
        })
      }
      </ul>
    );
  },
  render() {
    const { activeDishTypeId, dishTypesData, dishesData } = this.props;
    const dishElements = this.buildDishElements(activeDishTypeId, dishTypesData, dishesData, this.onDishBtnTap);
    return (
      <div className="dish-scroller">
        {/* <div className="scroll-wrapper">*/}
          {dishElements}
        {/* </div>*/}
      </div>
    );
  },
});
