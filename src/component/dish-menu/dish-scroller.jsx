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
    onScroll: React.PropTypes.func,
  },
  componentDidMount() {
    const { onScroll } = this.props;
    const cache = this._cache = {};
    const iScroll = cache.iScroll = new IScroll(findDOMNode(this), { probeType: 1 });
    iScroll.on('scrollStart', () => cache.isScorlling = true);
    iScroll.on('scroll', () => onScroll(null, this.findCurrentDishTypeId(iScroll.y)));
    iScroll.on('scrollEnd', () => cache.isScorlling = false);
  },
  shouldComponentUpdate() {
    return !this._cache.isScorlling;
  },
  componentDidUpdate() {
    const iScroll = this._cache.iScroll;
    iScroll.refresh();
    const activeDishType = findDOMNode(this).querySelector('.active');
    if (activeDishType) {
      iScroll.scrollToElement(activeDishType, 300);
    }
  },
  componentWillUnmount() {
    this._cache.iScroll.destroy();
    this._cache = null;
  },
  findCurrentDishTypeId(posY) {
    const dishTypes = findDOMNode(this).querySelectorAll('.dish-item-type');
    const showingDishTypes = Array.prototype.slice.call(dishTypes).filter(dishType => dishType.offsetTop > -posY);
    return parseInt(showingDishTypes[0].getAttribute('data-id'), 10);
  },
  buildDishList(activeDishTypeId, dishTypesData, dishesData) {
    function getDishById(dishId) {
      return _find(dishesData, { id:dishId });
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
                return (<li className="dish-item-dish"><DishListItem dishData={dishData} /></li>);
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
    const dishList = this.buildDishList(activeDishTypeId, dishTypesData, dishesData);
    return (
      <div className="dish-scroller">
        {/* <div className="scroll-wrapper">*/}
          {dishList}
        {/* </div>*/}
      </div>
    );
  },
});
