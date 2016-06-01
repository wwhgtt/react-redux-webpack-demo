const React = require('react');
const helper = require('../../../helper/dish-hepler');
const Counter = require('../../mui/counter.jsx');

require('./dish-detail-item.scss');

module.exports = React.createClass({
  displayName: 'DishDetailItem',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    onCountChange: React.PropTypes.func.isRequired,
  },
  onCountChange(newCount, increament) {
    this.props.onCountChange(increament);
  },
  render() {
    const { dishData } = this.props;
    return (
      <div className="dish-detail-item">
        <div className="dish-detail-item-main">
          <span className="dish-price price">{helper.getDishPrice(dishData)}</span>
          <p className="dish-name">{dishData.name}／{dishData.unitName} <span className="price">{dishData.marketPrice}</span></p>
        </div>
        <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onCountChange} step={dishData.stepNum} />
      </div>
    );
  },
});
