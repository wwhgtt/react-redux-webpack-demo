const React = require('react');
require('./quick-menu.scss');
const helper = require('../../../helper/dish-hepler');
const shopId = helper.getUrlParam('shopId');
const type = helper.getUrlParam('type');
const tableKey = helper.getUrlParam('tablekey');
const tableId = helper.getUrlParam('tableId');
const config = require('../../../config');
const ServiceBell = require('./service-bell.jsx');
const orderDetailUrl = `${config.orderDetailURL}?shopId=${shopId}`;
const cartOrderUrl = `${config.cartOrderURL}?type=${type}&shopId=${shopId}`;

const QuickMenu = React.createClass({
  displayName: 'QuickMenu',
  propTypes:{
    callBell:React.PropTypes.func.isRequired,
    clearBell:React.PropTypes.func.isRequired,
    callMsg:React.PropTypes.object.isRequired,
    callAble:React.PropTypes.bool.isRequired,
    timerStatus:React.PropTypes.bool.isRequired,
    dishes: React.PropTypes.array.isRequired,
    serviceStatus: React.PropTypes.object,
  },
  getInitialState() {
    return {
      expandMenu:false,
      animate:'',
      hideComponent:'hide',
    };
  },
  componentWillMount() {},
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hideComponent:'' });
    }, 400);
  },
  setBillClass(enableOrder, isLogin) {
    // 不带桌台的时候
    if (!tableKey && !tableId) {
      if (!enableOrder || !isLogin) {
        return 'bill-menu-gray';
      }
    } else { // 带桌台的时候
      if (!enableOrder) {
        return 'bill-menu-gray';
      }
    }
    return '';
  },
  setPayClass(enablePay) {
    if (!enablePay) {
      return 'pay-menu-gray';
    }
    return '';
  },
  setCallClass(enableCallService) {
    if (!enableCallService) {
      return 'call-menu-gray';
    }
    return '';
  },
  goToDetail(enableOrder, isLogin) { // 进入订单详情页
    // 不带桌台的时候
    if (!tableKey && !tableId) {
      if (enableOrder && isLogin) {
        location.href = orderDetailUrl;
      }
    } else { // 带桌台的时候
      if (enableOrder) {
        location.href = orderDetailUrl;
      }
    }
  },
  goToPay(enablePay) { // 进入下单页面
    if (enablePay) {
      location.href = `${config.dishBoxTsURL}?type=TS&shopId=${shopId}`;
    }
  },
  jumpDetail(num) {
    const { serviceStatus } = this.props;
    if (num) {
      if (serviceStatus.isLogin) {
        location.href = cartOrderUrl; // 跳转到购物车详情页面
      } else {
        location.href = `${config.logAddressURL}?shopId=${shopId}&returnUrl=${encodeURIComponent(cartOrderUrl)}`; // 跳转到登录页面
      }
    }
  },
  bellMenu() {
    const status = this.state.expandMenu;
    if (status) {
      this.setState({ animate:'' }, () => {
        setTimeout(() => {
          this.setState({ expandMenu:false });
        }, 400);
      });
    } else {
      this.setState({ expandMenu:true }, () => {
        this.setState({ animate:'animation' });
      });
    }
  },
  render() {
    const { expandMenu, animate, hideComponent } = this.state;
    const { callBell, clearBell, callMsg, callAble, timerStatus, dishes, serviceStatus } = this.props;
    // 逻辑判断
    const billColor = this.setBillClass(serviceStatus.data.enableOrder, serviceStatus.isLogin);
    const payColor = this.setPayClass(serviceStatus.data.enablePay);
    const callColor = this.setCallClass(serviceStatus.data.enableCallService);

    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes);
    let cartIconClass = 'cart-icon cart-icon--tiny cart-icon--fixed';
    if (!dishesCount) {
      cartIconClass += ' cart-icon--transparent';
    }
    return (
      <div>
        {
          serviceStatus.data.isShow ?
            <div>
              <div className="menuouter">
                <div className="main-menu" onTouchTap={this.bellMenu}>
                  <i className={expandMenu ? 'main-menu-inner extra' : 'main-menu-inner'}></i>
                </div>
                <div className={expandMenu ? 'menu-outer' : `menu-outer vh ${hideComponent}`}>
                  <ServiceBell
                    callColor={callColor}
                    callBell={callBell}
                    clearBell={clearBell}
                    callMsg={callMsg}
                    animate={animate}
                    expandMenu={expandMenu}
                    callAble={callAble}
                    timerStatus={timerStatus}
                  />
                  <div
                    className={expandMenu ? `bill-menu bill-menu-${animate} ${billColor}` : 'bill-menu'}
                    onTouchTap={() => this.goToDetail(serviceStatus.data.enableOrder, serviceStatus.isLogin)}
                  >
                    <i className="bill-menu-inner"></i>
                    <span className="detail">已下单</span>
                  </div>
                  <div
                    className={expandMenu ? `pay-menu pay-menu-${animate} ${payColor}` : 'pay-menu'}
                    onTouchTap={() => this.goToPay(serviceStatus.data.enablePay)}
                  >
                    <i className="pay-menu-inner"></i>
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
