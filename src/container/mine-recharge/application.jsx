const React = require('react');
const connect = require('react-redux').connect;
require('../../asset/style/style.scss');
require('./application.scss');
const mineRechargeAction = require('../../action/mine/mine-recharge.js');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const RechargeItem = require('../../component/mine/recharge-item.jsx');
const shopIcon = require('../../asset/images/default.png');

const MineRechargeApplication = React.createClass({
  displayName: 'MineRechargeApplication',
  propTypes: {
    getRechargeInfo: React.PropTypes.func,
    rechargeInfo: React.PropTypes.object,
    brandInfo: React.PropTypes.object,
    addRecharge: React.PropTypes.func,
    getUserInfo: React.PropTypes.func,
    getBrandInfo: React.PropTypes.func,
    userInfo: React.PropTypes.object,
  },

  getInitialState() {
    return {
      rechargeValue: '',
      isDialogShow: false,
      rechargeAdStyle: {},
      isShowLastAd: false,
      isShowAds: true,
      lastRechargeAdStyle: {
        top: 44,
      },
    };
  },

  componentWillMount() {
    const { getUserInfo, getRechargeInfo, getBrandInfo } = this.props;
    getRechargeInfo();
    getUserInfo();
    getBrandInfo();
  },

  componentWillReceiveProps(nextProps) {
    const { ruleInfo } = nextProps.rechargeInfo || {};

    if (!this.state.rechargeValue) {
      if (ruleInfo && ruleInfo.ruleList && ruleInfo.ruleList.length) {
        this.setState({ rechargeValue: ruleInfo.ruleList[0].fullValue });
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this._setInterval && this._adNo > 1) {
      let num = this._adNo;
      let i = 0;
      this._setInterval = setInterval(() => {
        if (i === num - 1) {
          i = -1;
          this.setState({ isShowAds: false });
          this.setState({ rechargeAdStyle: {
            top: 44,
          } });
          setTimeout(() => {
            this.setState({ lastRechargeAdStyle: {
              top: 0,
            } });
          }, 1);
          this.setState({ isShowLastAd: true });
          setTimeout(() => {
            this.setState({ isShowLastAd: false });
            this.setState({ lastRechargeAdStyle: {
              top: 44,
            } });
            this.setState({ isShowAds: true });
          }, 2800);
        }
        this.setState({ rechargeAdStyle: {
          top: -44 * i,
        } });
        i ++;
      }, 3000);
    }
  },

  componentWillUnmount() {
    clearInterval(this._setInterval);
  },

  // 选择的充值金额
  setChooseValue(value) {
    this.setState({ rechargeValue: value });
  },

  handleRecharge() {
    if (!this.state.rechargeValue) {
      return;
    }
    this.props.addRecharge(this.state.rechargeValue);
  },

  // 关闭活动详情
  handleClose() {
    this.setState({ isDialogShow: false });
  },

  // 显示活动详情
  handleShowDialog() {
    this.setState({ isDialogShow: true });
  },

  render() {
    const { rechargeInfo, userInfo, brandInfo } = this.props;
    const { isDialogShow,
      rechargeAdStyle,
      rechargeValue,
      isShowLastAd,
      isShowAds,
      lastRechargeAdStyle,
    } = this.state;
    let rechargeActiveItems = [];
    let rechargeActiveAds = [];
    let rechargeItem = '';
    let lastRechargeAd = '';
    const buttons = [{
      text: '确定',
      className: 'btn-recharge-active',
      onClick: this.handleClose,
    }];

    // 充值卡
    if (rechargeInfo.ruleInfo && rechargeInfo.ruleInfo.ruleList) {
      let realAmount = 0;
      const isFullSend = rechargeInfo.ruleInfo.isFullSend;
      rechargeItem = rechargeInfo.ruleInfo.ruleList.map((item, index) => {
        realAmount = item.fullValue;
        // 是否有优惠
        if (isFullSend === 0) {
          // 赠送固定金额
          if (rechargeInfo.ruleInfo.sendType === 1) {
            realAmount = item.fullValue + item.sendValue;
          } else if (rechargeInfo.ruleInfo.sendType === 2) {
            // 赠送百分比
            realAmount = item.fullValue + (item.rate * item.fullValue / 100);
          }
        }

        return (<RechargeItem
          rechargeInfo={item}
          realAmount={realAmount}
          key={index}
          onSetChooseValue={this.setChooseValue}
          isFullSend={isFullSend}
          isChoosed={rechargeValue === item.fullValue}
        />);
      });
    }

    // 充值活动
    if (rechargeInfo.planRuleList) {
      rechargeInfo.planRuleList.forEach((items) =>
        items.rules.forEach((item, index) => {
          let couponType = '';
          const couponTypeStr = item.couponType.toString();
          if (couponTypeStr === '1') {
            couponType = '满减券';
          } else if (couponTypeStr === '2') {
            couponType = '折扣券';
          } else if (couponTypeStr === '3') {
            couponType = '礼品券';
          } else if (couponTypeStr === '4') {
            couponType = '代金券';
          } else {
            couponType = '优惠券';
          }

          const rechargeActiveItem = (<div key={Math.random() + index} className="recharge-coupon">
            <p className="ellipsis">储值满{item.storeAmount}送{couponType}({item.couponName}）</p>
            <p className="ellipsis">【活动时间】{items.planStartDay}~{items.planEndDay}</p>
          </div>);
          const rechargeActiveAd = <div key={Math.random() + index}>储值满{item.storeAmount}送{couponType}</div>;
          rechargeActiveAds.push(rechargeActiveAd);
          rechargeActiveItems.push(rechargeActiveItem);
        })

      );
    }
    lastRechargeAd = rechargeActiveAds[rechargeActiveAds.length - 1];
    this._adNo = rechargeActiveAds.length;

    return (<div className="recharge-page application">
      {Boolean(rechargeActiveAds.length) && (
        <div className="recharge-ads" onTouchTap={this.handleShowDialog}>
          <div className="recharge-ads-img"></div>
          {isShowAds &&
            <div className="recharge-ads-title ellipsis" style={rechargeAdStyle}>
              {rechargeActiveAds}
            </div>
          }
          {isShowLastAd &&
            <div className="recharge-ads-title ellipsis" style={lastRechargeAdStyle}>
              <div>{lastRechargeAd}</div>
            </div>
          }
          <a className="recharge-ads-detail">活动详情></a>
        </div>
        )
      }
      <div className="recharge-banner">
        <div className="recharge-logo">
        {brandInfo.brand &&
          <img
            className="recharge-logo-img"
            role="presentation" src={brandInfo.brand.logo || shopIcon}
          />
        }
        </div>
        <div className="recharge-info">
          <p className="recharge-info-title">您充值的会员卡号为：</p>
          <div className="recharge-info-phone">
          {
            userInfo.mobile && (<div>
              <span>{(userInfo.mobile).substring(0, 3)}</span>
              <span>{(userInfo.mobile).substring(3, 7)}</span>
              <span>{(userInfo.mobile).substring(7)}</span>
            </div>
            )
          }
          </div>
        </div>
      </div>
      <div className="recharge-content">
        <div className="recharge-block">
          {rechargeItem}
        </div>
        <div className="recharge-operate">
          <a className="btn-recharge" onTouchTap={this.handleRecharge}>立即充值</a>
        </div>
        {
          isDialogShow && <Dialog
            hasTopBtnClose={false}
            title={'活动详情'}
            onClose={this.handleClose}
            buttons={buttons}
            theme="sliver"
          >
            <div>{rechargeActiveItems}</div>
          </Dialog>
        }
      </div>
    </div>);
  },
});

module.exports = connect(state => state, mineRechargeAction)(MineRechargeApplication);
