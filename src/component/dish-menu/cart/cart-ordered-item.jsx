const React = require('react');
const Counter = require('../../mui/counter.jsx');
const helper = require('../../../helper/dish-hepler');
module.exports = React.createClass({
  displayName: 'CartOrderedItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
  },
  onOrderBtnTap(newCount, increment) {
    const { dishData, onOrderBtnTap } = this.props;
    onOrderBtnTap(dishData, increment);
  },
  render() {
    const { dishData } = this.props;
    return (
      <div className="cart-ordered-item">
        {
          helper.isSingleDishWithoutProps(dishData) ?
            <span className="dish-name">{dishData.name}</span>
            :
            <a className="dish-name-arrow arrow-up">{dishData.name}</a>
        }
        <span className="dish-price">{helper.getDishPrice(dishData)}</span>
        <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onOrderBtnTap} step={dishData.stepNum} />
      </div>
    );
  },
});
