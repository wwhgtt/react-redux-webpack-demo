const React = require('react');
const actions = require('../../action/order-detail-in/order-detail-in.js');
const connect = require('react-redux').connect;
const OrderInfo = require('../../component/order-detail-in/order-info.jsx');
const DishInfo = require('../../component/order-detail-in/dish-info.jsx');
const shopIcon = require('../../asset/images/default.png');

require('../../asset/style/style.scss');
require('./application.scss');

const OrderDetailInApplication = React.createClass({
  displayName: 'OrderDetailIn',
  propTypes: {
    orderDetail: React.PropTypes.object,
    getOrderDetailUncheck: React.PropTypes.func,
  },
  // getInitialState() {
  //   return {
  //     orderDetail: {},
  //   };
  // },

  componentWillMount() {
    this.props.getOrderDetailUncheck();
  },

  // componentWillReceiveProps(nextProps) {
  //   console.log('========000')
  //   console.log(nextProps)
  //   this.setState({ orderDetail: nextProps.orderDetail });
  // },

  render() {
    const { orderDetail } = this.props;
    // console.table(orderDetail)
    const orderInfo = {
      shopIcon: orderDetail.shopLogo ? orderDetail.shopLogo : shopIcon,
      shopName: orderDetail.shopName,
      orderNo: orderDetail.serialNo,
      customNum: orderDetail.peopleCount,
      // deskNo: orderDetail.tableNo,
      deskNo: { area: '大厅区', table: '05678桌' },
    };

    let dishInfo = '';

    if (orderDetail.orderMetas) {
      dishInfo = orderDetail.orderMetas.map((item, index) =>
        <DishInfo orderDetail={item} key={index} />
      );
    }
    return (
      <div className="flex-columns">
        <div className="flex-rest">
          <OrderInfo orderInfo={orderInfo} />
          {dishInfo}
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
          <div className="btn-count-dis">
            <a href="" className="btn--yellow btn-dish">继续点菜</a>
            <a className="btn-count">结账</a>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    orderDetail: state.orderDetail,
  };
};

module.exports = connect(mapStateToProps, actions)(OrderDetailInApplication);
