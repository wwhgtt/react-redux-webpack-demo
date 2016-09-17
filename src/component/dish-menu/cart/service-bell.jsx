const React = require('react');
require('./service-bell.scss');
const config = require('../../../config');
const commonHelper = require('../../../helper/common-helper');
const Hammer = require('react-hammerjs');
const shopId = commonHelper.getUrlParam('shopId');

const ServiceBell = React.createClass({
  displayName: 'ServiceBell',
  propTypes:{
    callBell:React.PropTypes.func.isRequired,
    callMsg:React.PropTypes.object,
  },
  getInitialState() {
    return {
      isMenu:false,
      isShow:false,
      animate:'',
      animateBar:'',
      callStatus:false,
      timerStatus:false,
      extraStatus:'',
      hideOuter:'hide',
      callMsg:{},
      options:{
        touchAction:'compute',
        recognizers: {
          press: {
            time: 3100,
          },
        },
      },
    };
  },
  componentWillMount() {},
  componentDidMount() {
    setTimeout(() => {
      this.setState({ hideOuter:'' });
    }, 400);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({ callMsg: nextProps.callMsg, callStatus: nextProps.callMsg.callStatus, extraStatus: nextProps.callMsg.extraStatus });
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
      location.href = `http://testweixin.shishike.com/order/orderallDetail?shopId=${shopId}&orderId=3501396`;
    }
  },
  payIsAble(info) {
    if (!info.confirm) {
      return 'pay-bell-gray';
    }
    return false;
  },
  gotoPay(info) { // 进入下单页面
    if (info.confirm) {
      location.href = `http://testweixin.shishike.com/orderall/dishBox?type=TS&shopId=${shopId}`;
    }
  },
  // 呼叫
  callBegin(e) {
    e.preventDefault();
    const { timerStatus } = this.state;
    if (!timerStatus) {
      this.setState({ isShow:true, callStatus:false, animateBar:'', extraStatus:'' }, () => {
        this.setState({ animateBar:'animation' });
      });
    } else {
      this.setState({ isShow:true, animateBar:'' });
    }
  },
  callEnd() {
    this.setState({ isShow:false, animateBar:'' });
  },
  callPress(timer) {
    const { timerStatus } = this.state;
    const { callBell } = this.props;
    if (!timerStatus) {
      // this.interValStatus(timer);
      // 在此处进行呼叫吧台的操作
      // ...
      callBell(timer, this);
    }
  },
  fillBar(num) {
    const { animateBar, callStatus, timerStatus, callMsg, extraStatus } = this.state;
    let way1 = 'progress vh';
    let way2 = 'progress vh';
    let way3 = 'progress vh';
    if (timerStatus && callStatus) {
      way1 = 'progress';
    } else if (!timerStatus) {
      if (extraStatus === 0) {
        way2 = 'progress';
      } else {
        way3 = 'progress';
      }
    }

    return (
      <div>
        <div className={way1}>
          <span className="middle"></span>
          <div className="progress-holder">
            <span>
              客官稍等，服务员马上就来
            </span>
          </div>
          <span className="middle"></span>
        </div>
        <div className={way2}>
          <span className="middle"></span>
          <div className="progress-holder">
            <span>
              {callMsg.info}
            </span>
          </div>
          <span className="middle"></span>
        </div>
        <div className={way3}>
          <span className="middle"></span>
          <div className="progress-holder">
            <p className="bar">
              <i className={`bar-inner bar-inner-${animateBar}`}></i>
            </p>
            <span>
              按住发送
            </span>
          </div>
          <span className="middle"></span>
        </div>
      </div>
    );
  },
  render() {
    const { isShow, isMenu, animate, timerStatus, options, hideOuter } = this.state;
    // 逻辑判断
    const info = { list:[0, 1, 2, 3], confirm:true };
    const bill = this.billIsAble(info);
    const pay = this.payIsAble(info);
    const call = (bill === 'bill-bell-gray' || timerStatus) ? 'call-bell-gray' : '';
    // animateBar 60秒间隔
    const timer = 10;
    const fillBar = this.fillBar(timer);
    return (
      <div>
        <div className="bellouter">
          <div className="main-bell" onTouchTap={this.bellMenu}>
            <i className={isMenu ? 'main-bell-inner extra' : 'main-bell-inner'}></i>
          </div>
          <div className={isMenu ? 'menu-outer' : `menu-outer vh ${hideOuter}`}>
            <Hammer onTouchStart={this.callBegin} onTouchEnd={this.callEnd} onPress={() => this.callPress(timer)} options={options}>
              <div className={isMenu ? `call-bell call-bell-${animate} ${call}` : 'call-bell'}>
                <i className="call-bell-inner"></i>
                <span className="detail">呼叫</span>
              </div>
            </Hammer>
            <div className={isMenu ? `bill-bell bill-bell-${animate} ${bill}` : 'bill-bell'} onTouchTap={() => this.gotoDetail(info)}>
              <i className="bill-bell-inner"></i>
              <span className="detail">已下单</span>
            </div>
            <div className={isMenu ? `pay-bell pay-bell-${animate} ${pay}` : 'pay-bell'} onTouchTap={() => this.gotoPay(info)}>
              <i className="pay-bell-inner"></i>
              <span className="detail">结账</span>
            </div>
          </div>
          <div className={isShow ? '' : 'vh'}>{fillBar}</div>
        </div>
      </div>
    );
  },
});

module.exports = ServiceBell;
