const React = require('react');

const BindPhoneSuccess = React.createClass({
  propTypes: {
    phoneNum: React.PropTypes.string,
  },

  // 3秒后跳转到**页面
  componentDidMount() {
    setTimeout(() => {
      window.location.href = '/register-member.html';
    }, 3000);
  },

  render() {
    return (
      <div className="bind-account mt40">
        <div className="phone-img-green"></div>
        <div className="account-info">
          <div className="account-info-current">当前绑定的手机号</div>
          <span className="account-info-userName">{this.props.phoneNum}</span>
        </div>
      </div>

    );
  },
});

module.exports = BindPhoneSuccess;
