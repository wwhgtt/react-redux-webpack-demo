const React = require('react');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;

const returnUrl = getUrlParam('returnUrl') || '';
const shopId = getUrlParam('shopId');

const ActivateBoundApplication = React.createClass({
  displayName: 'ActivateBoundApplication',
  propTypes: {
    onLogout: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,

  },

  handleActivate() {
    this.props.onLogout(this.handleSuccessLogout, this.handleFaildLogout);
  },

  // 成功退出
  handleSuccessLogout() {
    location.href = `http://${location.host}/user/validBindMobileActive?shopId=${shopId}&returnUrl=${returnUrl}`;
  },

  // 退出失败
  handleFaildLogout() {
    this.props.setErrorMsg('操作失败，请重试');
  },

  render() {
    return (
      <div className="activate-bound flex-rest">
        <div className="activate-img activate-img-bound"></div>
        <div className="activate-info">
          <p className="activate-info-title">非常抱歉</p>
          <p className="activate-info-item">当前登录手机号已与其他微信号绑定过</p>
          <p className="activate-info-item">请使用对应微信号或其他手机号激活</p>
        </div>
        <div className="activate-operate">
          <a className="btn--yellow" onTouchTap={this.handleActivate}>使用其他手机号激活</a>
        </div>
      </div>
    );
  },
});

module.exports = ActivateBoundApplication;
