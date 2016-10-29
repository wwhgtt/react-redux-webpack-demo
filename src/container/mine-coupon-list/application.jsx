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
    couponList:React.PropTypes.object.isRequired,
    getCouponList:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { couponStatus:1 };
  },
  componentWillMount() {},
  componentDidMount() {
    const { getCouponList } = this.props;
    getCouponList();
  },
  getCouponStatus(num) {
    switch (num) {
      case 0: this.setState({ couponStatus:1 }); break;
      case 1: this.setState({ couponStatus:3 }); break;
      case 2: this.setState({ couponStatus:2 }); break;
      default: break;
    }
  },
  render() {
    const { errorMessage, clearErrorMsg, load, couponList } = this.props;
    const { couponStatus } = this.state;
    const navis = ['未使用', '已过期', '已使用'];
    return (
      <div className="application">
        <SwitchNavi navis={navis} getCouponStatus={this.getCouponStatus} />
        <CouponList couponList={couponList} couponStatus={couponStatus} />
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipLevelApplication);
