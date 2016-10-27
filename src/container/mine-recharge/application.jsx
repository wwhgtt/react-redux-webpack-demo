const React = require('react');
const connect = require('react-redux').connect;
require('../../asset/style/style.scss');
require('./application.scss');
const mineRechargeAction = require('../../action/mine/mine-recharge.js');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const RechargeItem = require('../../component/mine/recharge-item.jsx');

const MineRechargeApplication = React.createClass({
  displayName: 'MineRechargeApplication',
  propTypes: {
    getRechargeInfo: React.PropTypes.func,
    rechargeInfo: React.PropTypes.object,
    addRecharge: React.PropTypes.func,
  },

  getInitialState() {
    return {
      rechargeValue: 0,
      isChose: false,
    };
  },

  componentWillMount() {
    this.props.getRechargeInfo();
  },

  // 选择的充值金额
  setChoseValue(value) {
    this.setState({ rechargeValue: value });
  },

  handleRecharge() {
    this.props.addRecharge(this.state.rechargeValue);
  },

  render() {
    const { rechargeInfo } = this.props;
    let rechargeActiveItem = [];
    let rechargeItem = '';

    // 充值卡
    if (rechargeInfo.ruleInfo && rechargeInfo.ruleInfo.ruleList) {
      rechargeItem = rechargeInfo.ruleInfo.ruleList.map((item, index) =>
        <RechargeItem rechargeInfo={item} key={index} onSetChoseValue={this.setChoseValue} />
      );
    }

    // 充值活动
    if (rechargeInfo.planRuleList) {
      rechargeInfo.planRuleList.forEach((items) =>
        items.rules.forEach((item, index) => {
          let couponType = '';
          if (item.couponType === 1) {
            couponType = '满减券';
          } else if (item.couponType === 2) {
            couponType = '折扣券';
          } else if (item.couponType === 3) {
            couponType = '礼品券';
          } else if (item.couponType === 4) {
            couponType = '代金券';
          }

          const a = (<div key={Math.random() + index}>
            <p>储值满{item.storeAmount}送{couponType}({item.couponName}）</p>
            <p>【活动时间】{items.planStartDay}~{items.planEndDay}</p>
          </div>);
          rechargeActiveItem.push(a);
        })

      );
    }

    console.log(rechargeActiveItem);

    return (<div className="recharge-page">
      <div className="recharge-ads">
        <div className="recharge-ads-img"></div>
        <div className="recharge-ads-title ellipsis">活动标题内容</div>
        <a className="recharge-ads-detail">活动详情></a>
      </div>
      <div className="recharge-banner">
        <div className="recharge-logo">
          <img
            className="recharge-logo-img"
            role="presentation" src="https://ss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/0e40e9bb8ee9809d3333240f"
          />
        </div>
        <div className="recharge-info">
          <p className="recharge-info-title">您充值的会员卡号为：</p>
          <p className="recharge-info-phone">
            <span>132</span>
            <span>8128</span>
            <span>3611</span>
          </p>
        </div>
      </div>
      <div className="recharge-content">
        <div className="recharge-block">
          {rechargeItem}
        </div>
        <div className="recharge-operate">
          <a className="btn-recharge" onTouchTap={this.handleRecharge}>立即充值</a>
        </div>
        <Dialog
          title={'活动详情'}

        >
          {rechargeActiveItem}
          <div>
            <p>储值满</p>
            <p>【活动时间】</p>
          </div>
        </Dialog>
      </div>
    </div>);
  },
});

module.exports = connect(state => state, mineRechargeAction)(MineRechargeApplication);
