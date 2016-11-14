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
    return { couponStatus:'coupon-canUse' };
  },
  componentWillMount() {},
  componentDidMount() {
    const { getCouponList } = this.props;
    getCouponList();
  },
  getCouponStatus(num) {
    switch (num) {
      case 0: this.setState({ couponStatus:'coupon-canUse' }); break;
      case 1: this.setState({ couponStatus:'coupon-used' }); break;
      case 2: this.setState({ couponStatus:'coupon-outOfDate' }); break;
      default: break;
    }
  },
  render() {
    const { errorMessage, clearErrorMsg, load, weixinCouponList, loyaltyCouponList } = this.props;
    const { couponStatus } = this.state;
    const navis = ['未使用', '已使用', '已过期'];
    return (
      <div className={`${couponStatus} application`}>
        <SwitchNavi navis={navis} getIndex={this.getCouponStatus} />
        <CouponList weixinCouponList={weixinCouponList} loyaltyCouponList={loyaltyCouponList} />
        {load.status && <Loading word={load.word} />}
        {errorMessage && <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipLevelApplication);
