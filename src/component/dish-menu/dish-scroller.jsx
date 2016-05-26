const React = require('react');
const _find = require('lodash.find');
const DishListItem = require('./dish-list-item.jsx');
module.exports = React.createClass({
  displayName: 'DishScroller',
  propTypes: {
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array.isRequired,
    dishesData: React.PropTypes.array.isRequired,
  },
  buildDishList(activeDishTypeId, dishTypesData, dishesData) {
    function getDishById(dishId) {
      return _find(dishesData, { id:dishId });
    }
    return (
      <ul className="dist-list">
      {
        dishTypesData.map((dishTypeData, idx) => {
          if (!dishTypeData.dishIds) {
            return false;
          }
          return (
            [<li key={`dish-type-${dishTypeData.id}`} className="dist-item-type">{dishTypeData.name}</li>].concat(
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
        <div className="scroll-wrapper">
          {dishList}
        </div>
      </div>
    );
  },
});
