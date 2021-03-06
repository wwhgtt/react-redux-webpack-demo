const React = require('react');
const connect = require('react-redux').connect;
const getUrlParam = require('../../helper/common-helper').getUrlParam;
require('../../asset/style/style.scss');
require('./application.scss');
const mineRechargeAction = require('../../action/mine/mine-recharge.js');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const RechargeItem = require('../../component/mine/recharge-item.jsx');
const Toast = require('../../component/mui/toast.jsx');
const shopIcon = require('../../asset/images/logo_default.svg');
const classnames = require('classnames');
const shopId = getUrlParam('shopId');

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
    errorMessage: React.PropTypes.string,
    setErrorMsg: React.PropTypes.func,
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
      errorMessage: '',
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
    this.setState({ errorMessage: nextProps.errorMessage });

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
    const { userInfo } = this.props;
    const { rechargeValue } = this.state;
    if (!this.state.rechargeValue) {
      return;
    }

    if (userInfo.bindMobile) {
      this.props.addRecharge(rechargeValue);
    } else {
      this.setState({ errorMessage: '充值需要绑定手机号哟，正在带您去绑定……' });
    }
  },

  // 比较
  rechargeCompare(firstNum, nextNum) {
    if (nextNum > firstNum) {
      return 1;
    } else if (firstNum === nextNum) {
      return 0;
    }
    return -1;
  },

  // 关闭活动详情
  handleClose() {
    this.setState({ isDialogShow: false });
  },

  // 显示活动详情
  handleShowDialog() {
    this.setState({ isDialogShow: true });
  },

  handleClearErrorMessage() {
    const returnUrl = encodeURIComponent(location.href);
    // this.setState({ errorMessage: '' });
    this.props.setErrorMsg('');
    if (!this.props.userInfo.bindMobile) {
      location.href = `http://${location.host}/user/bindMobile?shopId=${shopId}&returnUrl=${returnUrl}#phone-validate`;
    }
  },

  render() {
    const { rechargeInfo, userInfo, brandInfo } = this.props;
    const { isDialogShow,
      rechargeAdStyle,
      rechargeValue,
      isShowLastAd,
      isShowAds,
      lastRechargeAdStyle,
      isShowRechargeTips,
      errorMessage,
    } = this.state;
    let rechargeActiveItems = [];
    let rechargeActiveAds = [];
    let rechargeItem = '';
    let lastRechargeAd = '';

    const isChargeMemo = rechargeInfo.chargeMemo && rechargeInfo.chargeMemo.replace(/\s/g, '');

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

          const rechargeActiveItem = (<div key={index + Math.random() * 10} className="recharge-coupon">
            <p className="ellipsis">储值满{item.storeAmount}</p>
            <p className="ellipsis">送{couponType}({item.couponName}）</p>
            <p className="ellipsis">{items.planStartDay.replace(/-/g, '/')} ~ {items.planEndDay.replace(/-/g, '/')}</p>
          </div>);
          const rechargeActiveAd = <div key={index + Math.random() * 10}>储值满{item.storeAmount}送{couponType}</div>;

          rechargeActiveAds.push(rechargeActiveAd);
          rechargeActiveItems.push(rechargeActiveItem);
        })

      );
    }
    rechargeActiveAds = rechargeActiveAds.sort((firstValue, nextValue) => {
      const firstNum = parseFloat(firstValue.props.children[1]);
      const nextNum = parseFloat(nextValue.props.children[1]);
      return this.rechargeCompare(firstNum, nextNum);
    });

    rechargeActiveItems = rechargeActiveItems.sort((firstValue, nextValue) => {
      const firstNum = parseFloat(firstValue.props.children[0].props.children[1]);
      const nextNum = parseFloat(nextValue.props.children[0].props.children[1]);
      return this.rechargeCompare(firstNum, nextNum);
    });

    lastRechargeAd = rechargeActiveAds[rechargeActiveAds.length - 1];
    this._adNo = rechargeActiveAds.length;

    const hasAds = !!rechargeActiveAds.length;
    return (<div className={classnames('recharge-page application', { 'ads-emtpy': !hasAds })}>
      {hasAds && (
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
        {userInfo.mobile &&
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
        }
        {isChargeMemo &&
          <a className="recharge-tips" onTouchTap={() => { this.setState({ isShowRechargeTips: true }); }}>储值说明</a>
        }
      </div>
      <div className="recharge-content">
        <div className="recharge-block">
          {rechargeItem}
        </div>
        {rechargeInfo.supportMemberCharge &&
          <div className="recharge-operate">
            <a className="btn-recharge" onTouchTap={this.handleRecharge}>立即充值</a>
          </div>
        }
        {
          isDialogShow && <Dialog
            hasTopBtnClose={false}
            title={'活动详情'}
            onClose={this.handleClose}
            theme="sliver"
          >
            <div>{rechargeActiveItems}</div>
          </Dialog>
        }
        {isShowRechargeTips &&
          <Dialog
            hasTopBtnClose={false}
            title={'储值说明'}
            onClose={() => { this.setState({ isShowRechargeTips: false }); }}
            theme="sliver"
          >
            <p className="recharge-tips-content">{rechargeInfo.chargeMemo}</p>
          </Dialog>
        }
        {errorMessage &&
          <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMessage} />
        }
      </div>
      <div className="recharge-footer copyright"></div>
    </div>);
  },
});

module.exports = connect(state => state, mineRechargeAction)(MineRechargeApplication);
