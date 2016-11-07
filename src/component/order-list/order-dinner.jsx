const React = require('react');
const OrderListItem = require('./order-list-item.jsx');
const shopLogoDefault = require('../../asset/images/logo_default.svg');

const OrderDinner = React.createClass({
  displayName: 'OrderDinner',
  propTypes: {
    orderList: React.PropTypes.object,
  },

  render() {
    const { orderList } = this.props;
    const orderDetail = {
      serialNumber: orderList.serialNumber,
      tradeItemsShortCut: orderList.tradeItemsShortCut,
      createTime: orderList.createTime,
      price: orderList.price,
    };

    return (
      <div className="order-list-group">
        <div className="list-head clearfix">
          <a className="list-head-href">
            <img src={orderList.shopLogo || shopLogoDefault} role="presentation" className="list-head-img" />
            <span className="list-head-title ellipsis">{orderList.shopName}</span>
          </a>
          <span className="list-head-status">{orderList.status}</span>
        </div>
        <OrderListItem orderDetail={orderDetail} />
      </div>
    );
  },
});

module.exports = OrderDinner;
