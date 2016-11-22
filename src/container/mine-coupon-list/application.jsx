const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-coupon-list.js');
require('../../asset/style/style.scss');
require('./application.scss');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const SwitchNavi = require('../../component/mui/switch-navi.jsx');
const CouponList = require('../../component/mine/coupon-list.jsx');

const MineVipLevelApplication = React.createClass({
  displayName: 'MineVipLevelApplication',
  propTypes:{
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
    load:React.PropTypes.object,
    // couponList:React.PropTypes.array.isRequired,
    weixinCouponList:React.PropTypes.array,
    loyaltyCouponList:React.PropTypes.array,
    getCouponList:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { couponStatus:'coupon-canUse', activeTab:0 };
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    const { getCouponList } = this.props;
    getCouponList();
  },
  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const hash = location.hash;
    let activeTab = 0;
    if (hash === '#used') {
      activeTab = 1;
      this.setState({ couponStatus:'coupon-used' });
    } else if (hash === '#outOfUse') {
      activeTab = 2;
      this.setState({ couponStatus:'coupon-outOfDate' });
    } else {
      activeTab = 0;
      location.hash = '#canUse';
      this.setState({ couponStatus:'coupon-canUse' });
    }

    this.setState({ activeTab });
  },
  getCouponStatus(num) {
    switch (num) {
      case 0: {
        location.hash = '#canUse';
        break;
      }
      case 1: {
        location.hash = '#used';
        break;
      }
      case 2: {
        location.hash = '#outOfUse';
        break;
      }
      default: {
        location.hash = '#canUse';
        break;
      }
    }
  },
  render() {
    const { errorMessage, clearErrorMsg, load, weixinCouponList, loyaltyCouponList } = this.props;
    const { couponStatus, activeTab } = this.state;
    const navis = ['未使用', '已使用', '已过期'];
    return (
      <div className={`${couponStatus} application`}>
        <SwitchNavi navis={navis} getIndex={this.getCouponStatus} activeTab={activeTab} />
        <CouponList weixinCouponList={weixinCouponList} loyaltyCouponList={loyaltyCouponList} />
        {load.status && <Loading word={load.word} />}
        {errorMessage && <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipLevelApplication);
