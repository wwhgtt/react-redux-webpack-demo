const React = require('react');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const shopId = helper.getUrlParam('shopId');
const classnames = require('classnames');
require('./book-button.scss');

const bookButton = React.createClass({
  displayName: 'bookButton',
  propTypes: {
    dishes:React.PropTypes.array,
  },
  getInitialState() {
    return {};
  },
  gotoBookDetail(dishesCount) {
    if (dishesCount) {
      location.href = `${config.bookCheckOrderURL}?shopId=${shopId}&type=YD`;
    }
  },
  render() {
    const { dishes } = this.props;
    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes) || 0;
    return (
      <div className={classnames('bookok', { 'bookok-transparent':!dishesCount })} onTouchTap={() => this.gotoBookDetail(dishesCount)}>
        预定
        {
          dishesCount ?
            <span className="bookok-num">{dishesCount}</span>
          :
          false
        }
      </div>
    );
  },
});

module.exports = bookButton;

