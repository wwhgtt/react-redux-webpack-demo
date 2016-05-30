const React = require('react');
const { findDOMNode } = require('react-dom');
const _find = require('lodash.find');
const IScroll = require('iscroll/build/iscroll-probe');
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
  },
  componentDidMount() {
    const { onScroll } = this.props;
    const cache = this._cache = {};
    const iScroll = cache.iScroll = new IScroll(findDOMNode(this), { probeType: 2 });
    iScroll.on('scroll', () => {
      const dishTypeId = this.findCurrentDishTypeId(iScroll.y);
      if (cache.isTouching && dishTypeId) {
        onScroll(null, dishTypeId);
      }
    });
    iScroll.on('scrollEnd', () => {
      const dishTypeId = this.findCurrentDishTypeId(iScroll.y);
      if (cache.isTouching && dishTypeId) {
        onScroll(null, dishTypeId);
      }
    });
  },
  // shouldComponentUpdate() {
  //   return !this._cache.isTouching;
  // },
  componentDidUpdate() {
    const cache = this._cache;
    const iScroll = cache.iScroll;
    iScroll.refresh();
    const activeDishType = findDOMNode(this).querySelector('.active');
    if (activeDishType && !cache.isTouching && !cache.isTaping) { // if update is not caused by scrolling or touching in dish-scroller.
      iScroll.scrollToElement(activeDishType, 300);             // that mean it's caused by activeDishType, so scrollTo the according dish type
    }
  },
  componentWillUnmount() {
    this._cache.iScroll.destroy();
    this._cache = null;
  },
  onTouchStart() {
    this._cache.isTouching = true;
  },
  onTouchEnd() {
    this._cache.isTouching = false;
  },
  onDishItemBtnTap(dishData, action) {
    const { onOrderBtnTap, onPropsBtnTap } = this.props;
    this._cache.isTaping = true;
    if (action) {
      onOrderBtnTap(dishData, action);
    } else {
      onPropsBtnTap(dishData);
    }
    setTimeout(() => this._cache.isTaping = false, 0); // set isTaping to false at nextTick of rendering;
  },
  findCurrentDishTypeId(posY) {
    const dishTypes = findDOMNode(this).querySelectorAll('.dish-item-type');
    const showingDishTypes = Array.prototype.slice.call(dishTypes).filter(dishType => dishType.offsetTop < -posY + 5);
    if (showingDishTypes.length) {
      return parseInt(showingDishTypes.pop().getAttribute('data-id'), 10);
    }
    return false;
  },
  buildDishList(activeDishTypeId, dishTypesData, dishesData, onDishItemBtnTap) {
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
                {dishTypeData.name}
              </li>,
            ].concat(
              dishTypeData.dishIds.map(dishId => {
                const dishData = getDishById(dishId);
                return (<li className="dish-item-dish"><DishListItem
                  dishData={dishData} onOrderBtnTap={onDishItemBtnTap} onPropsBtnTap={onDishItemBtnTap}
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
    const dishList = this.buildDishList(activeDishTypeId, dishTypesData, dishesData, this.onDishItemBtnTap);
    return (
      <div className="dish-scroller" onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
        {/* <div className="scroll-wrapper">*/}
          {dishList}
        {/* </div>*/}
      </div>
    );
  },
});
