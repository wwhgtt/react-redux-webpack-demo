const React = require('react');

const ActivateBoundApplication = React.createClass({
  displayName: 'ActivateBoundApplication',
  propTypes: {

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
          <a className="btn--yellow">使用其他手机号激活</a>
        </div>
      </div>
    );
  },
});

module.exports = ActivateBoundApplication;
