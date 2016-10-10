const React = require('react');
require('./quick-menu.scss');
const helper = require('../../../helper/dish-hepler');
const cartHelper = require('../../../helper/order-dinner-cart-helper');
const shopId = helper.getUrlParam('shopId');
const type = helper.getUrlParam('type') || 'TS';
const config = require('../../../config');
const ServiceBell = require('./service-bell.jsx');
const tradeDetailUncheckUrl = `${config.tradeDetailUncheckURL}?type=${type}&shopId=${shopId}`;
const dishCart4DinnerUrl = `${config.dishCart4DinnerURL}?type=${type}&shopId=${shopId}`;
const classnames = require('classnames');
const isShopOpen = require('../../../helper/dish-hepler.js').isShopOpen;

const tableKey = (cartHelper.getTableInfoInLocalStorage(shopId) || {}).tableKey || '';
const tableId = (cartHelper.getTableInfoInLocalStorage(shopId) || {}).tableId || '';

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
    openTimeList:React.PropTypes.array,
    isShowButton:React.PropTypes.bool.isRequired,
    shopNotOpenMsg:React.PropTypes.func,
  },
  getInitialState() {
    return {
      expandMenu:false,
      animate:'',
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  setCallClass(enableCallService) {
    if (!enableCallService) {
      return 'call-menu-gray';
    }
    return '';
  },
  goToDetail(enableOrder, isLogin) { // 进入订单详情页
    const orderId = JSON.parse(sessionStorage.serviceStatus || '{}').orderId || '';
    // 不带桌台的时候
    if (!tableKey && !tableId) {
      if (enableOrder && isLogin) {
        location.href = `${tradeDetailUncheckUrl}&orderId=${orderId}`;
      }
    } else { // 带桌台的时候
      if (enableOrder) {
        const tableParam = tableKey ? `&tableKey=${tableKey}` : `&tableId=${tableId}`;
        location.href = `${tradeDetailUncheckUrl}&orderId=${orderId}${tableParam}`;
      }
    }
  },
  goToPay(enablePay) { // 进入结算页面
    const tradeId = JSON.parse(sessionStorage.serviceStatus || '{}').orderId || '';
    if (enablePay) {
      location.href = `${config.settlement4DinnerURL}?type=TS&shopId=${shopId}&tradeId=${tradeId}`;
    }
  },
  jumpDetail(evt, num) {
    const { openTimeList, shopNotOpenMsg } = this.props;
    let tableParam = '';
    if (tableKey) {
      tableParam = `&tableKey=${tableKey}`;
    } else if (tableId) {
      tableParam = `&tableId=${tableId}`;
    }
    if (!isShopOpen(openTimeList)) {
      shopNotOpenMsg('非常抱歉，门店已打烊');
      return false;
    }
    evt.preventDefault();
    const { serviceStatus } = this.props;
    if (num) {
      if (serviceStatus.isLogin) {
        location.href = `${dishCart4DinnerUrl}${tableParam}`; // 跳转到购物车详情页面
      } else {
        const returnUrl = `${dishCart4DinnerUrl}${tableParam}`;
        location.href = `${config.logAddressURL}?shopId=${shopId}&returnUrl=${encodeURIComponent(returnUrl)}`; // 跳转到登录页面
      }
    }
    return true;
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
    const { expandMenu, animate } = this.state;
    const { callBell, clearBell, callMsg, callAble, timerStatus, dishes, serviceStatus, openTimeList, isShowButton } = this.props;
    // 逻辑判断
    const payAnimate = JSON.parse(`{ "pay-menu-${animate}": ${expandMenu} }`);
    const billAnimate = JSON.parse(`{ "bill-menu-${animate}": ${expandMenu} }`);
    const callColor = this.setCallClass(serviceStatus.data.enableCallService);

    const orderedDishes = helper.getOrderedDishes(dishes);
    const dishesCount = helper.getDishesCount(orderedDishes);
    let cartIconClass = 'cart-icon cart-icon--tiny cart-icon--fixed';
    if (!dishesCount || !isShopOpen(openTimeList)) {
      cartIconClass += ' cart-icon--transparent';
    }
    return (
      <div>
        {
          isShowButton ?
            <div>
              <div className="menuouter">
                <div className="main-menu" onTouchTap={this.bellMenu}>
                  <i className={classnames('main-menu-inner', { extra: expandMenu })}></i>
                </div>
                <div className="menu-outer">
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
                    className={classnames('bill-menu',
                      billAnimate,
                      { 'bill-menu-gray': !tableKey && !tableId && (!serviceStatus.data.enableOrder || !serviceStatus.isLogin) },
                      { 'bill-menu-gray': (tableKey || tableId) && !serviceStatus.data.enableOrder },
                    )}
                    onTouchTap={() => this.goToDetail(serviceStatus.data.enableOrder, serviceStatus.isLogin)}
                  >
                    <i className="bill-menu-inner"></i>
                    <span className="detail">已下单</span>
                  </div>
                  <div
                    className={classnames('pay-menu',
                      payAnimate,
                      { 'pay-menu-gray': !serviceStatus.data.enablePay }
                    )}
                    onTouchTap={() => this.goToPay(serviceStatus.data.enablePay)}
                  >
                    <i className="pay-menu-inner"></i>
                    <span className="detail">结账</span>
                  </div>
                </div>
              </div>
              <button
                className={cartIconClass}
                onTouchTap={(evt) => this.jumpDetail(evt, dishesCount)}
                data-count={dishesCount || null}
              >
              </button>
            </div>
          :
            <button
              className={cartIconClass}
              onTouchTap={(evt) => this.jumpDetail(evt, dishesCount)}
              data-count={dishesCount || null}
            >
            </button>
        }
      </div>
    );
  },
});
module.exports = QuickMenu;
