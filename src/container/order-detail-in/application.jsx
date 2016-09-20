const React = require('react');
const OrderInfo = require('../../component/order-detail-in/order-info.jsx');
const DishInfo = require('../../component/order-detail-in/dish-info.jsx');
const shopIcon = require('../../asset/images/default.png');

require('../../asset/style/style.scss');
require('./application.scss');

const OrderDetailInApplication = React.createClass({
  render() {
    const orderInfo = {
      shopIcon: '' || shopIcon,
      shopName: '测试店名（软件园店）',
      orderNo: '001',
      customNum: 5,
      deskNo: {
        area: '大厅区',
        table: '001桌',
      },
    };

    return (
      <div className="flex-columns">
        <div className="flex-rest">
          <OrderInfo orderInfo={orderInfo} />
          <DishInfo />
          <div className="options-group">
            <div className="option">
              <span>共 {4} 份商品</span>
              <div className="fr">
                <span>总计:</span>
                <span className="text-neon-carrot">{'￥1234'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-none">
          <a href="" className="btn--yellow">继续点餐</a>
          <a className="">结账</a>
        </div>
      </div>
    );
  },
});

module.exports = OrderDetailInApplication;
