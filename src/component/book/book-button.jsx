const React = require('react');
const config = require('../../config');
const helper = require('../../helper/dish-helper');
const shopId = helper.getUrlParam('shopId');
const classnames = require('classnames');
require('./book-button.scss');

const bookButton = React.createClass({
  displayName: 'bookButton',
  propTypes: {
    dishesCount:React.PropTypes.number,
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
    const { dishesCount, type } = this.props;
    let typeName = '';
    if (type === 'YD') {
      typeName = '预定';
    } else if (type === 'PD') {
      typeName = '排队';
    }
    return (
      <div className={classnames('bookok', { 'bookok-transparent':!dishesCount })} onTouchTap={() => this.gotoBookDetail(dishesCount)}>
        {typeName}
      </div>
    );
  },
});

module.exports = bookButton;

