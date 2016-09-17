const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const shopId = commonHelper.getUrlParam('shopId');
// const mid = commonHelper.getCookie('mid');
const settingUrl = `${config.mineSettingURL}?shopId=${shopId}`;
const creditUrl = `${config.integralURL}?shopId=${shopId}`;
const remainUrl = `${config.valueCardURL}?shopId=${shopId}`;
const mainIndexUrl = `${config.memberIndexURL}?shopId=${shopId}`;
const rechargeUrl = `${config.rechargeURL}?shopId=${shopId}`;
const orderallListUrl = `${config.orderallListURL}?shopId=${shopId}`;
const getCouponListUrl = ` ${config.getCouponListURL}?shopId=${shopId}`;
const addressListUrl = `${config.addressListURL}?shopId=${shopId}`;
const registerUrl = ` ${config.registerMemberURL}?shopId=${shopId}`;
const bindMobileUrl = ` ${config.bindMobileURL}?shopId=${shopId}`;
const bindWXUrl = ` ${config.bindWXURL}?shopId=${shopId}`;

require('./ShowMenuList.scss');

module.exports = React.createClass({
  displayName: 'Name',
  propTypes:{
    info:React.PropTypes.object.isRequired,
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
    let partOne = '';
    let partTwo = '';
    let partThree = '';
    let partFour = '';
    const isWeiXinBroswer = commonHelper.getWeixinVersionInfo().weixin;
    const { info } = this.props;
    // 几种状态的判断
    if (info.loginType === 1 && !info.bindMobile) {
      condition = 1;
    } else if (info.loginType === 0 && !info.bindWx) {
      if (!info.isMember) {
        condition = 2;
      } else {
        condition = 3;
      }
    } else if (info.bindWx && info.bindMobile) {
      condition = 4;
    }
    // 几种状态的判断

    if (condition === 3 || condition === 4 && info.isMember) {
      partOne = (
        <div>
          <div className="menuLink mt of">
            <div className="menuLink-holder fl" onTouchTap={this.jumpToCredit}>
              <p className="menuLink-holder-p title">我的积分</p>
              <p className="menuLink-holder-p num">{info.score}</p>
            </div>
            <div className="menuLink-holder fl" onTouchTap={this.jumpToRemain}>
              <p className="menuLink-holder-p title">我的余额</p>
              <p className="menuLink-holder-p num">{info.balance}</p>
            </div>
          </div>
          <ul className="list-ul">
            <li className="list-ul-li" name="会员卡">
              <a className="menuLink" href={mainIndexUrl}>
                <i className="icon" name="HYK"></i>
                <span className="name">会员卡</span>
                <span className="arrow"></span>
              </a>
            </li>
            <li className="list-ul-li" name="会员充值">
              <a className="menuLink" href={rechargeUrl}>
                <i className="icon" name="HYCZ"></i>
                <span className="name">会员充值</span>
                <span className="arrow"></span>
              </a>
            </li>
          </ul>
        </div>
      );
    }
    if (condition === 3 && isWeiXinBroswer) { // 同时要是微信浏览器
      partTwo = (
        <li className="list-ul-li" name="绑定微信号">
          <a className="menuLink" href={bindWXUrl}>
            <i className="icon" name="BDWX"></i>
            <span className="name">绑定微信号</span>
            <span className="arrow"></span>
          </a>
        </li>
      );
    }

    if (!info.isMember || (condition === 1 && !info.bindMobile) || (condition === 2 && !info.bindWx)) {
      partThree = (
        <ul className="list-ul">
          {
            !info.isMember ?
              <li className="list-ul-li" name="会员注册">
                <a className="menuLink" href={registerUrl}>
                  <i className="icon" name="HYZC"></i>
                  <span className="name">会员注册</span>
                  <span className="brief">注册会员享受更多福利</span>
                  <span className="arrow"></span>
                </a>
              </li>
            :
            false
          }
          {
            condition === 1 && !info.bindMobile ?
              <li className="list-ul-li" name="绑定手机号">
                <a className="menuLink" href={bindMobileUrl}>
                  <i className="icon" name="BDSJ"></i>
                  <span className="name">绑定手机号</span>
                  <span className="arrow"></span>
                </a>
              </li>
            :
            false
          }
          {
            condition === 2 && !info.bindWx && isWeiXinBroswer ? // 同时要是微信浏览器
              <li className="list-ul-li" name="绑定微信号">
                <a className="menuLink" href={bindWXUrl}>
                  <i className="icon" name="BDWX"></i>
                  <span className="name">绑定微信号</span>
                  <span className="arrow"></span>
                </a>
              </li>
            :
            false
          }
        </ul>
      );
    }
    if (info.bindMobile) {
      partFour = (
        <li className="list-ul-li" name="优惠券">
          <a className="menuLink" href={getCouponListUrl}>
            <i className="icon" name="YH"></i>
            <span className="name">优惠券</span>
            <span className="arrow"></span>
          </a>
        </li>
      );
    }
    // return
    return (
      <div className="list-outer">
        {partOne}
        <ul className="list-ul">
          <li className="list-ul-li" name="订单中心">
            <a className="menuLink" href={orderallListUrl}>
              <i className="icon" name="DD"></i>
              <span className="name">订单中心</span>
              <span className="arrow"></span>
            </a>
          </li>
          {partFour}
          <li className="list-ul-li" name="地址管理">
            <a className="menuLink" href={addressListUrl}>
              <i className="icon" name="DZ"></i>
              <span className="name">地址管理</span>
              <span className="arrow"></span>
            </a>
          </li>
          {partTwo}
        </ul>
        {partThree}
        <ul className="list-ul">
          <li className="list-ul-li" name="设置">
            <a className="menuLink" href={settingUrl}>
              <i className="icon" name="SZ"></i>
              <span className="name">设置</span>
              <span className="arrow"></span>
            </a>
          </li>
        </ul>
      </div>
    );
  },
});