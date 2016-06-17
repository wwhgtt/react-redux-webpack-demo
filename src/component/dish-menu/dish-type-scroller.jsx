const React = require('react');
const { findDOMNode } = require('react-dom');
const shallowCompare = require('react-addons-shallow-compare');
const IScroll = require('iscroll');
const DynamicClassLI = require('../mui/misc/dynamic-class-hoc.jsx')('li');
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
    this._cache.iScroll = new IScroll(findDOMNode(this), { scrollY:true });
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
              onTouchTap={this.onDishTypeElementTap}
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
