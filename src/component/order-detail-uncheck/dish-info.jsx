const React = require('react');
const OrderCustom = require('../../component/order-detail-uncheck/order-custom.jsx');
const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
require('./dish-info.scss');
// const shopIcon = require('../../asset/images/default.png');

const DishInfo = React.createClass({
  displayName: 'DishInfo',
  propTypes: {
    orderDetail: React.PropTypes.object,
  },

  render() {
    const { orderDetail } = this.props;
    const customInfo = {
      name: orderDetail.name,
      sex: orderDetail.sex,
      headUrl: orderDetail.headImage,
    };
    return (
      <div className="options-group">
        <div className="option dish-head">
          <span className="fl text-dusty-grey">下单时间 {orderDetail.dateTime}</span>
          <span className="fr dish-total-num">共{orderDetail.dishItems.length}份</span>
        </div>
        <OrderCustom customInfo={customInfo} />
        {
          orderDetail.dishItems.map((item, index) =>
            <DishDetail mainDish={item} key={index} />
          )
        }
      </div>
    );
  },
});

module.exports = DishInfo;
