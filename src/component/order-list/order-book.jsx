const React = require('react');
const ListHead = require('./list-head.jsx');

const OrderBook = React.createClass({
  displayName: 'OrderBook',
  propTypes: {
    bookList: React.PropTypes.object,
  },

  getBookInfo(bookList) {
    // 1,2,3,4,5,6 => 预定成功, 确认中, 已到店, 预定取消, 预定失败, 未到店
    let isOrange = false;
    let status = '';
    let bookInfo = {};
    const statusStr = String(bookList.bookingStatus);
    if (statusStr === '1') {
      status = '预订成功';
      isOrange = true;
    } else if (statusStr === '2') {
      status = '确认中';
      isOrange = true;
    } else if (statusStr === '3') {
      status = '已到店';
      isOrange = true;
    } else if (statusStr === '4') {
      status = '预订取消';
    } else if (statusStr === '5') {
      status = '预订失败';
    } else if (statusStr === '6') {
      status = '未到店';
    }

    bookInfo.isOrange = isOrange;
    bookInfo.status = status;
    return bookInfo;
  },

  render() {
    const { bookList } = this.props;
    const bookHead = {
      status: this.getBookInfo(bookList).status,
      shopLogo: bookList.shopLogo,
      shopName: bookList.shopName,
    };
    const isOrange = this.getBookInfo(bookList).isOrange;

    return (
      <div className="order-list-group">
        <ListHead headDetail={bookHead} isOrange={isOrange} />
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
