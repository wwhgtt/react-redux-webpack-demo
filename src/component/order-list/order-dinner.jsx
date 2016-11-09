const React = require('react');
const ListHead = require('./list-head.jsx');

const OrderDinner = React.createClass({
  displayName: 'OrderDinner',
  propTypes: {
    orderList: React.PropTypes.object,
    orderType: React.PropTypes.string.isRequired,
  },

  render() {
    const { orderList, orderType } = this.props;
    let isOrange = false;
    const status = orderList.status;
    if (orderType === 'TS') {
      if (status === '待支付' || status === '支付中' || status === '待确认' || status === '配送中') {
        isOrange = true;
      }
    } else if (orderType === 'WM') {
      if (status === '待支付' || status === '支付中' || status === '待确认' || status === '待配送' || status === '配送中') {
        isOrange = true;
      }
    }

    return (
      <div className="order-list-group">
        <ListHead headDetail={orderList} isOrange={isOrange} orderType={orderType} />
        <div className="list-content clearfix">
          <div className="list-num">
            <p className="list-num-name">流水号</p>
            <p className="list-num-no ellipsis">{orderList.serialNumber}</p>
          </div>
          <div className="list-detail">
            <p>
              <span className="list-detail-dish ellipsis">{orderList.tradeItemsShortCut}</span>
              <span className="list-detail-price price ellipsis">{orderList.price}</span>
            </p>
            <p className="list-detail-time">{orderList.createTime}</p>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = OrderDinner;
