const React = require('react');
require('./quick-menu.scss');
const commonHelper = require('../../../helper/common-helper');
const helper = require('../../../helper/dish-hepler');
const shopId = commonHelper.getUrlParam('shopId');
const type = commonHelper.getUrlParam('type');
const key = commonHelper.getUrlParam('key');
const tableId = commonHelper.getUrlParam('tableId');
const config = require('../../../config');
const ServiceBell = require('./service-bell.jsx');
const orderDetailUrl = `${config.orderDetailURL}?shopId=${shopId}`;
const dishBoxTsUrl = `${config.dishBoxTsURL}?type=TS&shopId=${shopId}`;
const cartOrderUrl = `${config.cartOrderURL}?type=${type}&shopId=${shopId}`;

const QuickMenu = React.createClass({
  displayName: 'QuickMenu',
  propTypes:{
    callBell:React.PropTypes.func.isRequired,
    clearBell:React.PropTypes.func.isRequired,
    callMsg:React.PropTypes.object.isRequired,
    canCall:React.PropTypes.bool.isRequired,
    timerStatus:React.PropTypes.bool.isRequired,
    dishes: React.PropTypes.array.isRequired,
    fetchTableId: React.PropTypes.func,
    fetchStatus: React.PropTypes.func,
    shopStatus: React.PropTypes.object,
  },
  getInitialState() {
    return {
      isMenu:false,
      animate:'',
      hideOuter:'hide',
    };
  },
  componentWillMount() {},
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hideOuter:'' });
    }, 400);
    const { fetchTableId, fetchStatus } = this.props;

    if (key || tableId) { // 带有key值
      fetchTableId(key, tableId);
    }
    // 获取基本数据
    fetchStatus();
  },
  bellMenu() {
    const status = this.state.isMenu;
    if (status) {
      this.setState({ animate:'' }, () => {
        setTimeout(() => {
          this.setState({ isMenu:false });
        }, 400);
      });
    } else {
      this.setState({ isMenu:true }, () => {
        this.setState({ animate:'animation' });
      });
    }
  },
  billIsAble(enableOrder, isLogin) {
    if (!enableOrder || !isLogin) {
      return 'bill-bell-gray';
    }
    return '';
  },
  gotoDetail(enableOrder, isLogin) { // 进入订单详情页
    if (enableOrder && isLogin) {
      location.href = orderDetailUrl;
    }
  },
  payIsAble(enablePay) {
    if (!enablePay) {
      return 'pay-bell-gray';
    }
    return '';
  },
  gotoPay(enablePay) { // 进入下单页面
    if (enablePay) {
      location.href = dishBoxTsUrl;
    }
  },
  callIsAble(enableCallService) {
    if (!enableCallService) {
      return 'call-bell-gray';
    }
    return '';
  },
  jumpDetail(num) {
    if (num) {
      location.href = cartOrderUrl; // 跳转到购物车详情页面
    }
  },
  render() {
    const { isMenu, animate, hideOuter } = this.state;
    const { callBell, clearBell, callMsg, canCall, timerStatus, dishes, shopStatus } = this.props;
    // 逻辑判断
    const info = { list:[], confirm:false };
    const billColor = this.billIsAble(shopStatus.data.enableOrder, shopStatus.isLogin);
    const payColor = this.payIsAble(shopStatus.data.enablePay);
    const callColor = this.callIsAble(shopStatus.data.enableCallService);

    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes);
    let cartIconClass = 'cart-icon cart-icon--tiny cart-icon--fixed';
    if (!dishesCount) {
      cartIconClass += ' cart-icon--transparent';
    }
    return (
      <div>
        {
          shopStatus.data.isShow ?
            <div>
              <div className="bellouter">
                <div className="main-bell" onTouchTap={this.bellMenu}>
                  <i className={isMenu ? 'main-bell-inner extra' : 'main-bell-inner'}></i>
                </div>
                <div className={isMenu ? 'menu-outer' : `menu-outer vh ${hideOuter}`}>
                  <ServiceBell
                    info={info}
                    callColor={callColor}
                    callBell={callBell}
                    clearBell={clearBell}
                    callMsg={callMsg}
                    animate={animate}
                    isMenu={isMenu}
                    canCall={canCall}
                    timerStatus={timerStatus}
                  />
                  <div
                    className={isMenu ? `bill-bell bill-bell-${animate} ${billColor}` : 'bill-bell'}
                    onTouchTap={() => this.gotoDetail(shopStatus.data.enableOrder, shopStatus.isLogin)}
                  >
                    <i className="bill-bell-inner"></i>
                    <span className="detail">已下单</span>
                  </div>
                  <div
                    className={isMenu ? `pay-bell pay-bell-${animate} ${payColor}` : 'pay-bell'}
                    onTouchTap={() => this.gotoPay(shopStatus.data.enablePay)}
                  >
                    <i className="pay-bell-inner"></i>
                    <span className="detail">结账</span>
                  </div>
                </div>
              </div>
              <button
                className={cartIconClass}
                onTouchTap={() => this.jumpDetail(dishesCount)}
                data-count={dishesCount || null}
              >
              </button>
            </div>
          :
            <button
              className={cartIconClass}
              onTouchTap={() => this.jumpDetail(dishesCount)}
              data-count={dishesCount || null}
            >
            </button>
        }
      </div>
    );
  },
});

module.exports = QuickMenu;
