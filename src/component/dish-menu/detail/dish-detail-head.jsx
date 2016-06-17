const React = require('react');
const helper = require('../../../helper/dish-hepler');
const Counter = require('../../mui/counter.jsx');

require('./dish-detail-head.scss');

module.exports = React.createClass({
  displayName: 'DishDetailHead',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCountChange: React.PropTypes.func.isRequired,
  },
  onCountChange(newCount, increament) {
    this.props.onCountChange(increament);
  },
  render() {
    const { dish } = this.props;
    return (
      <div className="dish-detail-head">
        <div className="head-main">
          <span className="dish-price price">{helper.getDishPrice(dish)}</span>
          <p className="dish-name">{dish.name}／{dish.unitName} <span className="price">{dish.marketPrice}</span></p>
        </div>
        <Counter count={helper.getDishesCount([dish])} onCountChange={this.onCountChange} step={dish.stepNum} />
      </div>
    );
  },
});
