const React = require('react');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const shopId = helper.getUrlParam('shopId');
require('./book-button.scss');

const bookButton = React.createClass({
  displayName: 'bookButton',
  propTypes: {
    dishes:React.PropTypes.array,
  },
  getInitialState() {
    return {};
  },
  gotoBookDetail() {
    location.href = `${config.bookCheckOrderURL}?shopId=${shopId}&type=YD`;
  },
  render() {
    const { dishes } = this.props;
    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCountYD = helper.getDishesCount(orderedDishes);
    return (
      <div className="bookok" onTouchTap={this.gotoBookDetail}>
        预定
        <span className="bookok-num">{dishesCountYD}</span>
      </div>
    );
  },
});

module.exports = bookButton;

