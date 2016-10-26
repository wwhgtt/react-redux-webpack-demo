const React = require('react');
require('./income-expenses-list.scss');

const IncomeExpensesList = React.createClass({
  displayName: 'IncomeExpensesList',
  propTypes: {
    listInfo: React.PropTypes.object,
    children: React.PropTypes.object,
  },

  render() {
    const { listInfo } = this.props;

    return (
      <div className="list-box">
        <div className="list-title">{listInfo.title}</div>
        <div className="list-detail">
          <span className="list-detail-item">{listInfo.time}</span>
          <span className="list-detail-item list-detail-name ellipsis">{listInfo.name}</span>
        </div>
        <div className="list-amount ellipsis">{this.props.children}</div>
      </div>
    );
  },
});

module.exports = IncomeExpensesList;
