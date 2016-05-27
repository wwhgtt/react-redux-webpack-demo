const React = require('react');
const { findDOMNode } = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin');
const IScroll = require('iscroll');
const DynamicClassLI = require('../mui/misc/dynamic-class-hoc.jsx')('li');
injectTapEventPlugin();
require('./dish-type-scroller.scss');

module.exports = React.createClass({
  displayName:'DishTypeScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onDishTypeItemTap: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    this._cache = {};
    this._cache.iScroll = new IScroll(findDOMNode(this), { scrollY:true });
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
  onDishTypeItemTap(evt) {
    const { onDishTypeItemTap } = this.props;
    const dishTypeId = parseInt(evt.target.getAttribute('data-id'), 10);
    onDishTypeItemTap(evt, dishTypeId);
  },
  buildDishTypeList(activeDishTypeId, dishTypesData, dishesData) {
    return (
      <ul className="dish-type-list">
        {dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          return (
            <DynamicClassLI
              key={idx} data-id={dishTypeData.id} isActive={activeDishTypeId === dishTypeData.id}
              className="dish-type-item"
              onTouchTap={this.onDishTypeItemTap}
            >
              {dishTypeData.name}
            </DynamicClassLI>
          );
        })}
      </ul>
    );
  },
  render() {
    const { activeDishTypeId, dishTypesData, dishesData } = this.props;

    const dishTypeList = this.buildDishTypeList(activeDishTypeId, dishTypesData, dishesData);

    return (
      <div className="dish-type-scroller">
        <div className="scroll-wrapper">
          {dishTypeList}
        </div>
      </div>
    );
  },
});
