const React = require('react');
require('./quick-menu.scss');
const commonHelper = require('../../../helper/common-helper');
const shopId = commonHelper.getUrlParam('shopId');
const config = require('../../../config');
const ServiceBell = require('./service-bell.jsx');
const orderDetailUrl = `${config.orderDetailURL}?shopId=${shopId}`;
const dishBoxTsUrl = `${config.dishBoxTsURL}?type=TS&shopId=${shopId}`;

const QuickMenu = React.createClass({
  displayName: 'QuickMenu',
  propTypes:{
    callBell:React.PropTypes.func.isRequired,
    clearBell:React.PropTypes.func,
    callMsg:React.PropTypes.object,
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
  billIsAble(info) {
    if (info.list.length === 0) {
      return 'bill-bell-gray';
    }
    return false;
  },
  gotoDetail(info) { // 进入订单详情页
    if (info.list.length !== 0) {
      location.href = orderDetailUrl;
    }
  },
  payIsAble(info) {
    if (!info.confirm) {
      return 'pay-bell-gray';
    }
    return false;
  },
  gotoPay(info) { // 进入下单页面
    if (info.confirm && info.list.length !== 0) {
      location.href = dishBoxTsUrl;
    }
  },
  render() {
    const { isMenu, animate, hideOuter } = this.state;
    const { callBell, clearBell, callMsg } = this.props;
    // 逻辑判断
    const info = { list:[1], confirm:true };
    const bill = this.billIsAble(info);
    const pay = (bill === 'bill-bell-gray' || this.payIsAble(info)) ? 'pay-bell-gray' : '';
    const call = (bill === 'bill-bell-gray') ? 'call-bell-gray' : '';

    return (
      <div>
        <div className="bellouter">
          <div className="main-bell" onTouchTap={this.bellMenu}>
            <i className={isMenu ? 'main-bell-inner extra' : 'main-bell-inner'}></i>
          </div>
          <div className={isMenu ? 'menu-outer' : `menu-outer vh ${hideOuter}`}>
            <ServiceBell
              info={info}
              call={call}
              callBell={callBell}
              clearBell={clearBell}
              callMsg={callMsg}
              animate={animate}
              isMenu={isMenu}
            />
            <div className={isMenu ? `bill-bell bill-bell-${animate} ${bill}` : 'bill-bell'} onTouchTap={() => this.gotoDetail(info)}>
              <i className="bill-bell-inner"></i>
              <span className="detail">已下单</span>
            </div>
            <div className={isMenu ? `pay-bell pay-bell-${animate} ${pay}` : 'pay-bell'} onTouchTap={() => this.gotoPay(info)}>
              <i className="pay-bell-inner"></i>
              <span className="detail">结账</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = QuickMenu;
