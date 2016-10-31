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
let registerUrl = `${config.registerMemberURL}?shopId=${shopId}`;
const bindMobileUrl = ` ${config.bindMobileURL}?shopId=${shopId}`;
const bindWXUrl = ` ${config.bindWXURL}?shopId=${shopId}`;

require('./show-menu-list.scss');

module.exports = React.createClass({
  displayName: 'ShowMenuList',
  propTypes:{
    info:React.PropTypes.object.isRequired,
  },
  componentWillMount() {},
  componentDidMount() {},
  getFontSize(length) {
    if (length > 8) {
      return { fontSize:`${8 / length * 1.563}em` };
    }
    return { fontSize:'1.563em' };
  },
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
    const scoreFontSize = info.score ? this.getFontSize(info.score.toString().length) : { fontSize:'1.563em' };
    const balanceFontSize = info.balance ? this.getFontSize(info.balance.toString().length) : { fontSize:'1.563em' };
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

    // 用户注册地址判断
    if (info.loginType === 1) {
      registerUrl = `http://${location.host}/user/validBindMobile?shopId=${shopId}`;
    } else if (info.loginType === 0) {
      registerUrl = `${registerUrl}&mobile=${info.mobile}`;
    }

    // 几种状态的判断
    if (condition === 3 || condition === 4 && info.isMember) {
      partOne = (
        <div>
          <div className="menuLink mt of">
            <div className="menuLink-holder fl" onTouchTap={this.jumpToCredit}>
              <p className="menuLink-holder-p scorenum" style={scoreFontSize}>{info.score}<span className="unit">分</span></p>
              <p className="menuLink-holder-p title">我的积分</p>
            </div>
            <div className="menuLink-holder fl" onTouchTap={this.jumpToRemain}>
              <p className="menuLink-holder-p balancenum" style={balanceFontSize}>{info.balance}<span className="unit">元</span></p>
              <p className="menuLink-holder-p title">我的余额</p>
            </div>
          </div>
          <div className="list-group">
            <div className="list-group-item" name="会员卡">
              <a className="list-group-link" href={mainIndexUrl}>
                <i className="icon" name="HYK"></i>
                <span className="name">会员卡</span>
                <span className="arrow arrow-right"></span>
              </a>
            </div>
            <div className="list-group-item" name="会员充值">
              <a className="list-group-link" href={rechargeUrl}>
                <i className="icon" name="HYCZ"></i>
                <span className="name">会员充值<b className="name-detail">充值+</b></span>
                <span className="arrow arrow-right"></span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    if (condition === 3 && isWeiXinBroswer) { // 同时要是微信浏览器
      partTwo = (
        <div className="list-group-item" name="绑定微信号">
          <a className="list-group-link" href={bindWXUrl}>
            <i className="icon" name="BDWX"></i>
            <span className="name">绑定微信号</span>
            <span className="arrow arrow-right"></span>
          </a>
        </div>
      );
    }

    if (!info.isMember || (condition === 1 && !info.bindMobile) || (condition === 2 && !info.bindWx)) {
      partThree = (
        <div className="list-group">
          {
            !info.isMember ?
              <div className="list-group-item" name="会员注册">
                <a className="list-group-link" href={registerUrl}>
                  <i className="icon" name="HYZC"></i>
                  <span className="name">会员注册</span>
                  <span className="brief">注册会员享受更多福利</span>
                  <span className="arrow arrow-right"></span>
                </a>
              </div>
            :
            false
          }
          {
            condition === 1 && !info.bindMobile ?
              <div className="list-group-item" name="绑定手机号">
                <a className="list-group-link" href={bindMobileUrl}>
                  <i className="icon" name="BDSJ"></i>
                  <span className="name">绑定手机号</span>
                  <span className="arrow arrow-right"></span>
                </a>
              </div>
            :
            false
          }
          {
            condition === 2 && !info.bindWx && isWeiXinBroswer ? // 同时要是微信浏览器
              <div className="list-group-item" name="绑定微信号">
                <a className="list-group-link" href={bindWXUrl}>
                  <i className="icon" name="BDWX"></i>
                  <span className="name">绑定微信号</span>
                  <span className="arrow arrow-right"></span>
                </a>
              </div>
            :
            false
          }
        </div>
      );
    }
    if (info.bindMobile) {
      partFour = (
        <div className="list-group-item" name="优惠券">
          <a className="list-group-link" href={getCouponListUrl}>
            <i className="icon" name="YH"></i>
            <span className="name">优惠券</span>
            <span className="arrow arrow-right"></span>
          </a>
        </div>
      );
    }
    // return
    return (
      <div className="list-outer">
        {partOne}
        <div className="list-group">
          <div className="list-group-item" name="订单中心">
            <a className="list-group-link" href={orderallListUrl}>
              <i className="icon" name="DD"></i>
              <span className="name">订单中心</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
          {partFour}
          <div className="list-group-item" name="地址管理">
            <a className="list-group-link" href={addressListUrl}>
              <i className="icon" name="DZ"></i>
              <span className="name">地址管理</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
          {partTwo}
        </div>
        {partThree}
        <div className="list-group">
          <div className="list-group-item" name="设置">
            <a className="list-group-link" href={settingUrl}>
              <i className="icon" name="SZ"></i>
              <span className="name">设置</span>
              <span className="arrow arrow-right"></span>
            </a>
          </div>
        </div>
      </div>
    );
  },
});
