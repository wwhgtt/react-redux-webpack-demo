const React = require('react');
const Counter = require('../mui/counter.jsx');

module.exports = React.createClass({
  displayName:'DishListItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
  },
  render() {
    const { dishData } = this.props;
    return (
      <div className="dis-list-item">
        <a href="" className="dish-item-img">{dishData.img}</a>
        <span className="dish-item-name">{dishData.name}</span>
        <span className="dish-item-price">{dishData.marketPrice}</span>
        <Counter />
      </div>
    );
  },
});
