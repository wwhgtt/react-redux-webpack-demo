const React = require('react');
const config = require('../../config');
const helper = require('../../helper/dish-helper');
const shopId = helper.getUrlParam('shopId');
const classnames = require('classnames');
require('./book-button.scss');

const bookButton = React.createClass({
  displayName: 'bookButton',
  propTypes: {
    dishes:React.PropTypes.array,
    type:React.PropTypes.string,
  },
  getInitialState() {
    return {};
  },
  gotoBookDetail(dishesCount) {
    const { type } = this.props;
    if (dishesCount) {
      if (type === 'YD') {
        location.href = `${config.bookCheckOrderURL}?shopId=${shopId}&type=YD`;
      } else if (type === 'PD') {
        location.href = `${config.queueCheckOrderURL}?shopId=${shopId}&type=PD`;
      }
    }
  },
  render() {
    const { dishes, type } = this.props;
    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes) || 0;
    let typeName = '';
    if (type === 'YD') {
      typeName = '预定';
    } else if (type === 'PD') {
      typeName = '排队';
    }
    return (
      <div className={classnames('bookok', { 'bookok-transparent':!dishesCount })} onTouchTap={() => this.gotoBookDetail(dishesCount)}>
        {typeName}
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

