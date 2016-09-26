const React = require('react');
const OrderCustom = require('../../component/order-detail-in/order-custom.jsx');
const DishDetail = require('../../component/order-detail-in/dish-detail.jsx');
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
          <span>{orderDetail.dishItems.length}份商品</span>
          <span className="fr text-dusty-grey">下单时间 {orderDetail.dateTime}</span>
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
