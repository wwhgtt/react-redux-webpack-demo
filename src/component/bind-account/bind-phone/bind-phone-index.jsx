const React = require('react');

const BindPhoneIndex = React.createClass({
  displayName:'BindPhoneIndex',
  render() {
    return (
      <div className="bind-account mt40">
        <div className="phone-img-grey"></div>
        <div className="account-info">
          <p className="account-info-state">您还没有绑定手机号</p>
          <p className="account-info-tips">绑定手机号码可以关联原有的手机号信息</p>
        </div>
        <a className="btn account-btn btn--yellow" href="#phone-validate">绑定手机号</a>
      </div>
    );
  },
});

module.exports = BindPhoneIndex;
