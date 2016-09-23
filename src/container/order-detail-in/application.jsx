const React = require('react');
const actions = require('../../action/order-detail-in/order-detail-in.js');
const connect = require('react-redux').connect;
const OrderInfo = require('../../component/order-detail-in/order-info.jsx');
const DishInfo = require('../../component/order-detail-in/dish-info.jsx');
const DishDetail = require('../../component/order-detail-in/dish-detail.jsx');
const shopIcon = require('../../asset/images/default.png');
const Toast = require('../../component/mui/toast.jsx');
const getUrlParam = require('../../helper/common-helper').getUrlParam;
const orderId = getUrlParam('orderId');
const shopId = getUrlParam('shopId');

require('../../asset/style/style.scss');
require('./application.scss');

const OrderDetailInApplication = React.createClass({
  displayName: 'OrderDetailIn',
  propTypes: {
    orderDetail: React.PropTypes.object,
    getOrderDetailUncheck: React.PropTypes.func,
  },

  getInitialState() {
    return {
      errorMsg: '',
    };
  },

  componentWillMount() {
    this.props.getOrderDetailUncheck();
    setInterval(this.props.getOrderDetailUncheck, 10000);
  },

  handleStatus(dishStatus) {
    let statusType = '';
    if (dishStatus === 1) {
      statusType = 'status-square-uncheck';
    } else if (dishStatus === 2) {
      statusType = 'status-square-checked';
    }
    return statusType;
  },

  hanleCheck() {
    const { orderDetail } = this.props;
    if (orderDetail.priviledge) {
      this.setState({ errorMsg: '请联系服务员结账' });
    } else {
      location.href = `http://${location.host}/check?shopId=${shopId}&?tradeId=${orderId}`;
    }
  },

  handleDishMenu() {
    location.href = `http://${location.host}/orderall/selectDish?shopId=${shopId}&?tradeId=${orderId}`;
  },

  handleClearErrorMsg() {
    this.setState({ errorMsg: '' });
  },

  render() {
    const { orderDetail } = this.props;
    const { errorMsg } = this.state;
    const orderInfo = {
      shopIcon: orderDetail.shopLogo ? orderDetail.shopLogo : shopIcon,
      shopName: orderDetail.shopName,
      orderNo: orderDetail.serialNo,
      customNum: orderDetail.peopleCount,
      deskNo: { area: orderDetail.tableArea, table: orderDetail.tableNo },
    };
    let dishTotal = {};
    if (orderDetail.dishTotal) {
      dishTotal = orderDetail.dishTotal;
    }

    let btnDis = '';
    if (!orderDetail.hideCheckout) {
      btnDis = 'btn-count-dis';
    }
    const statusType = this.handleStatus(dishTotal.status);
    return (
      <div className="flex-columns">
        <div className="flex-rest">
          <OrderInfo orderInfo={orderInfo} />
          {
            orderDetail.orderMetas ?
            orderDetail.orderMetas.map((item, index) =>
              <DishInfo orderDetail={item} key={index} />
            )
            : ''
          }
          <div className="options-group">
            <div className="option order-status">
              <span>订单状态</span>
              <div className={`order-status-symbal status-square ${statusType}`}></div>
            </div>
            {
              dishTotal.dishItems ?
                dishTotal.dishItems.map((item, index) =>
                  <DishDetail mainDish={item} key={index} />
                )
              : ''
            }
            <div className="option">
              <span>优惠总计</span>
              <span className="discount fr">{dishTotal.priviledgeAmount}</span>
            </div>
            <div className="option">
              {
                dishTotal.dishItems ?
                  <span>共 {dishTotal.dishItems.length} 份商品</span>
                : ''
              }
              <div className="fr">
                <span>总计:</span>
                <span className="text-neon-carrot price">{dishTotal.totalRrice}</span>
              </div>
            </div>
          </div>
          <div className="options-group">
            <div className="option">
              <span className="order-demo-title fl">整单备注</span>
              <p className="order-demo-info fl">{dishTotal.memo}</p>
            </div>
          </div>
        </div>
        <div className="order-operate flex-none">
          <div className={btnDis}>
            <a className="btn--yellow btn-dish" onTouchTap={this.handleDishMenu}>继续点菜</a>
            <a className="btn-count" onTouchTap={this.hanleCheck}>结账</a>
          </div>
        </div>
        {
          errorMsg ?
            <Toast errorMessage={errorMsg} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
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
