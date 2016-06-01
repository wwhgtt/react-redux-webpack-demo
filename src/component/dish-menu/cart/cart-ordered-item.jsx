const React = require('react');
const Counter = require('../../mui/counter.jsx');
const helper = require('../../../helper/dish-hepler');

require('./cart-ordered-item.scss');

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
        <div className="ordered-item">
          {
            helper.isSingleDishWithoutProps(dishData) ?
              <span className="ellipsis dish-name">{dishData.name}</span>
              :
              <a className="ellipsis dish-name dish-name--trigger">{dishData.name}</a>
          }
          <span className="dish-price price">{helper.getDishPrice(dishData)}</span>
          <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onOrderBtnTap} step={dishData.stepNum} />
        </div>
        {/* <div className="ordered-item-dropdown"></div> */}
      </div>
    );
  },
});
