const React = require('react');
const { findDOMNode } = require('react-dom');
const IScroll = require('iscroll');
const dynamicClassHOC = require('../mui/misc/dynamic-class-hoc.jsx');

require('./dish-type-scroller.scss');

module.exports = React.createClass({
  displayName:'DishTypeScroller',
  propTypes: {
    activeDishTypeIdx: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
    onDishTypeItemClick: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    this._cache = {};
    this._cache.iscroll = new IScroll(findDOMNode(this).parentNode);
  },
  onDishTypeItemClick(evt, idx, dishTypeData) {
    this.props.onDishTypeItemClick(evt, idx, dishTypeData);
  },
  buildDishTypeList(activeDishTypeIdx, dishTypesData, dishesData) {
    const DynamicClassLI = dynamicClassHOC('li');
    return (
      <ul className="dish-type-list">
        {dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          return (
            <DynamicClassLI
              key={dishTypeData.id} isActive={activeDishTypeIdx === idx}
              onClick={evt => this.onDishTypeItemClick(evt, dishTypeData, idx)}
              className="dish-type-item"
            >
              {dishTypeData.name}
            </DynamicClassLI>
          );
        })}
      </ul>
    );
  },
  render() {
    const { activeDishTypeIdx, dishTypesData, dishesData } = this.props;

    const dishTypeList = this.buildDishTypeList(activeDishTypeIdx, dishTypesData, dishesData);

    return (
      <div className="dish-type-scroller">
        {dishTypeList}
      </div>
    );
  },
});
