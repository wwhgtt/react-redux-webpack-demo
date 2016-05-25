const React = require('react');
const { findDOMNode } = require('react-dom');
const IScroll = require('iscroll');

module.exports = React.createClass({
  displayName:'DishTypeScroller',
  propTypes: {
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
  },
  componentDidMount() {
    this._cache = {};
    this._cache.iscroll = new IScroll(findDOMNode(this));
  },
  buildDishTypeList(dishTypesData, dishesData) {
    return (
      <ul className="dish-type-list">
        {dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          return (<li key={dishTypeData.id} className="dish-type-item">{dishTypeData.name}</li>);
        })}
      </ul>
    );
  },
  render() {
    const { dishTypesData, dishesData } = this.props;

    const dishTypeList = this.buildDishTypeList(dishTypesData, dishesData);

    return (
      <div className="dish-type-scroller">
        {dishTypeList}
      </div>
    );
  },
});
