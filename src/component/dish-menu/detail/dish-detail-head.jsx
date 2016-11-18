const React = require('react');
const helper = require('../../../helper/dish-helper');
const Counter = require('../../mui/counter.jsx');

require('./dish-detail-head.scss');

module.exports = React.createClass({
  displayName: 'DishDetailHead',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCountChange: React.PropTypes.func.isRequired,
    onRecalcPrice: React.PropTypes.func,
  },
  componentDidMount() {
    const { dish } = this.props;
    this.props.onCountChange(dish.dishIncreaseUnit);
  },
  onCountChange(newCount, increament) {
    this.props.onCountChange(increament);
  },
  splitPropsSpecifications(dish) {
    if (dish.sameRuleDishes) {
      return false;
    }
    if (!helper.isSingleDishWithoutProps(dish) && dish.dishPropertyTypeInfos) {
      const specification = [];
      dish.dishPropertyTypeInfos.map(
        dishProperty => {
          if (dishProperty.type === 4) {
            specification.push(dishProperty.properties[0].name);
          }
          return false;
        }
      );
      return specification.length !== 0 ? '(' + specification.join(',') + ')' : false;
    }
    return false;
  },
  render() {
    const { dish, onRecalcPrice } = this.props;
    const price = helper.getDishPrice(dish);
    const count = helper.getDishesCount([dish]);
    let marketPrice = dish.marketPrice;

    if (onRecalcPrice) {
      marketPrice = onRecalcPrice(price, count);
    }
    return (
      <div className="dish-detail-head flex-none">
        <div className="head-main">
          <span className="dish-price price">{price}</span>
          <p className="dish-name">
            {dish.name}{this.splitPropsSpecifications(dish)}/{dish.unitName}<span>: &nbsp;</span>
            <span className="price">{marketPrice}</span>
          </p>
        </div>
        <Counter count={count} onCountChange={this.onCountChange} step={dish.stepNum} />
      </div>
    );
  },
});
