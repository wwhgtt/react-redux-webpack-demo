const React = require('react');
const DiningOptions = require('../order/dining-options.jsx');
require('./order-info.scss');

const OrderInfo = React.createClass({
  displayName: 'OrderInfo',
  propTypes: {
    orderInfo: React.PropTypes.object,
  },

  render() {
    const { orderInfo } = this.props;

    return (
      <div className="options-group">
        <div className="option shop-info">
          <img className="shop-info-icon" src={orderInfo.shopIcon} role="presentation" />
          <span className="shop-info-name ellipsis">{orderInfo.shopName}</span>
        </div>
        <div className="option">
          <DiningOptions
            dineSerialNumber={orderInfo.orderNo}
            dineCount={orderInfo.customNum}
            dineTableProp={orderInfo.deskNo}
          />
        </div>
      </div>
    );
  },
});

module.exports = OrderInfo;
