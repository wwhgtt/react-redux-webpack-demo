const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const shopId = commonHelper.getUrlParam('shopId');
// const mid = commonHelper.getCookie('mid');
const settingUrl = `${config.mineSettingURL}?shopId=${shopId}`;
const creditUrl = `${config.integralURL}?shopId=${shopId}`;
const remainUrl = `${config.valueCardURL}?shopId=${shopId}`;
const mainIndexUrl = `${config.memberIndexURL}?shopId=${shopId}`;
const rechargeUrl = `${config.rechargeURL}?shopId=${shopId}${shopId}`;
const orderallListUrl = `${config.orderallListURL}?shopId=${shopId}`;
const getCouponListUrl = ` ${config.getCouponListURL}?shopId=${shopId}`;
const addressListUrl = `${config.addressListURL}?shopId=${shopId}`;
const registerUrl = ` ${config.registerURL}?shopId=${shopId}`;
const bindaccountUrlphone = ` ${config.bindAccountURL}?shopId=${shopId}#bind-phone`;
const bindaccountUrlwx = ` ${config.bindAccountURL}?shopId=${shopId}#bind-wx`;

require('./ShowMenuList.scss');

module.exports = React.createClass({
  displayName: 'Name',
  propTypes:{
    info:React.PropTypes.object,
  },
  componentWillMount() {},
  componentDidMount() {},
  jumpToCredit() {
    window.location.href = creditUrl;
  },
  jumpToRemain() {
    window.location.href = remainUrl;
  },
  render() {
    let condition = ''; // 1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
    const { info } = this.props;
    // 几种状态的判断
    if (info.loginType === 'weixin' && !info.bindMobile) {
      condition = 1;
    } else if (info.loginType === 'mobile' && !info.bindWx) {
      if (!info.isMember) {
        condition = 2;
      } else {
        condition = 3;
      }
    } else if (info.bindWx && info.bindMobile) {
      condition = 4;
    }
    return (
      <div className="list-outer">
        {
        condition === 3 || condition === 4 ?
          <div>
            <div className="mineInfo of">
              <div className="mineInfo-holder fl" onTouchTap={this.jumpToCredit}>
                <p className="mineInfo-holder-p title">我的积分</p>
                <p className="mineInfo-holder-p num">{info.score}</p>
              </div>
              <div className="mineInfo-holder fl" onTouchTap={this.jumpToRemain}>
                <p className="mineInfo-holder-p title">我的余额</p>
                <p className="mineInfo-holder-p num">{info.balance}</p>
              </div>
            </div>
            <ul className="list-ul">
              <li className="list-ul-li" name="会员卡">
                <a className="menuLink" href={mainIndexUrl}>
                  <i name="HYK"></i>
                  <span className="name">会员卡</span>
                  <span className="arrow"></span>
                </a>
              </li>
              <li className="list-ul-li" name="会员充值">
                <a className="menuLink" href={rechargeUrl}>
                  <i name="HYCZ"></i>
                  <span className="name">会员充值</span>
                  <span className="arrow"></span>
                </a>
              </li>
            </ul>
          </div>
        :
           false
        }
        <ul className="list-ul">
          <li className="list-ul-li" name="订单中心">
            <a className="menuLink" href={orderallListUrl}>
              <i name="DD"></i>
              <span className="name">订单中心</span>
              <span className="arrow"></span>
            </a>
          </li>
          <li className="list-ul-li" name="优惠券">
            <a className="menuLink" href={getCouponListUrl}>
              <i name="YH"></i>
              <span className="name">优惠券</span>
              <span className="arrow"></span>
            </a>
          </li>
          <li className="list-ul-li" name="地址管理">
            <a className="menuLink" href={addressListUrl}>
              <i name="DZ"></i>
              <span className="name">地址管理</span>
              <span className="arrow"></span>
            </a>
          </li>
          {
          condition === 3 ?
            <li className="list-ul-li" name="绑定微信号">
              <a className="menuLink" href={bindaccountUrlwx}>
                <i name="BDWX"></i>
                <span className="name">绑定微信号</span>
                <span className="arrow"></span>
              </a>
            </li>
          :
          false
          }
        </ul>
        {
        condition !== 3 && condition !== 4 ?
          <ul className="list-ul">
            <li className="list-ul-li" name="会员注册">
              <a className="menuLink" href={registerUrl}>
                <i name="HYZC"></i>
                <span className="name">会员注册</span>
                <span className="brief">注册会员享受更多福利</span>
                <span className="arrow"></span>
              </a>
            </li>
            {
              condition === 1 ?
                <li className="list-ul-li" name="绑定手机号">
                  <a className="menuLink" href={bindaccountUrlphone}>
                    <i name="BDSJ"></i>
                    <span className="name">绑定手机号</span>
                    <span className="arrow"></span>
                  </a>
                </li>
              :
              false
            }
            {
              condition === 2 ?
                <li className="list-ul-li" name="绑定微信号">
                  <a className="menuLink" href={bindaccountUrlwx}>
                    <i name="BDWX"></i>
                    <span className="name">绑定微信号</span>
                    <span className="arrow"></span>
                  </a>
                </li>
              :
                false
            }
          </ul>
        :
        false
        }
        <ul className="list-ul">
          <li className="list-ul-li" name="设置">
            <a className="menuLink" href={settingUrl}>
              <i name="SZ"></i>
              <span className="name">设置</span>
              <span className="arrow"></span>
            </a>
          </li>
        </ul>
      </div>
    );
  },
});
