const React = require('react');
const ListHead = require('./list-head.jsx');

const OrderBook = React.createClass({
  displayName: 'OrderBook',
  propTypes: {
    bookList: React.PropTypes.object,
  },
  render() {
    const { bookList } = this.props;
    const bookHead = {
      status: bookList.bookingStatus,
      shopLogo: bookList.shopLogo,
      shopName: bookList.shopName,
    };
    return (
      <div className="order-list-group">
        <ListHead headDetail={bookHead} />
        <div className="list-book clearfix">
          <div className="list-inline">{bookList.orderTime}</div>
          <div className="fr">
            <span>{bookList.tablePersonCount}人桌</span>
            <span>{bookList.tableTypeName}</span>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = OrderBook;
