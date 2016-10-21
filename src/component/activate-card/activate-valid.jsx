const React = require('react');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;

const shopId = getUrlParam('shopId');
const mobile = getUrlParam('mobile');
const returnUrl = getUrlParam('returnUrl') || '';

const ActivateValidApplication = React.createClass({
  displayName: 'ActivateValidApplication',
  propTypes: {
    onBindWx: React.PropTypes.func,
  },

  handleActive() {
    const phoneInfo = {
      phoneNum: mobile,
    };

    this.props.onBindWx(phoneInfo, this.handleSuccessBind);
  },

  handleSuccessBind() {
    location.href = decodeURIComponent(returnUrl);
  },

  render() {
    return (
      <div className="activate-valid flex-rest">
        <div className="activate-img activate-img-valid"></div>
        <div className="activate-info">
          <p className="activate-info-item">您将使用已下手机号激活微信会员卡</p>
          <p className="activate-info-title">{mobile}</p>
          <p className="activate-info-item">激活后该微信号将与您的微信绑定</p>
          <p className="activate-info-item">如果该手机号不是您的，请使用其他手机号激活</p>
        </div>
        <div className="activate-operate">
          <a className="btn--yellow" onTouchTap={this.handleActive}>去激活</a>
          <a className="btn--yellow" href={`http://${location.host}/activate-validate.html?shopId=${shopId}`}>使用其他手机号激活</a>
        </div>
      </div>
    );
  },
});

module.exports = ActivateValidApplication;
