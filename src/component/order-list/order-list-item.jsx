const React = require('react');
require('./order-list-item.scss');

const OrderListItem = React.createClass({
  displayName: 'OrderListItem',
  propTypes: {
    orderDetail: React.PropTypes.object,
  },

  render() {
    const { orderDetail } = this.props;

    return (
      <div className="list-content clearfix">
        <div className="list-num">
          <p className="list-num-name">流水号</p>
          <p className="list-num-no ellipsis">{orderDetail.serialNumber}</p>
        </div>
        <div className="list-detail">
          <p>
            <span className="list-detail-dish ellipsis">{orderDetail.tradeItemsShortCut}</span>
            <span className="list-detail-price price ellipsis">{orderDetail.price}</span>
          </p>
          <p className="list-detail-time">{orderDetail.createTime}</p>
        </div>
      </div>
    );
  },
});

module.exports = OrderListItem;
