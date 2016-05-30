const React = require('react');
const DishDetailItem = require('./dish-detail-item.jsx');
module.exports = React.createClass({
  displayName: 'SingleDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
  },
  render() {
    const { dishData } = this.props;
    return (
      <div className="single-dish-detail">
        <DishDetailItem dishData={dishData} />
      </div>
    );
  },
});
