const React = require('react');
const config = require('../../../config');

const BindPhoneSuccess = React.createClass({
  displayName:'BindPhoneSucess',
  propTypes: {
    phoneInfo: React.PropTypes.object.isRequired,
  },

  // 3秒后跳转到**页面
  componentDidMount() {
    const shopId = this.props.phoneInfo.phoneShopId;
    setTimeout(() => {
      location.href = `${config.mineIndexURL}?shopId=${shopId}`;
    }, 3000);
  },

  render() {
    return (
      <div className="bind-account mt40">
        <div className="phone-img-green"></div>
        <div className="account-info">
          <div className="account-info-current">当前绑定的手机号</div>
          <span className="account-info-userName">{this.props.phoneInfo.phoneNum}</span>
        </div>
      </div>

    );
  },
});

module.exports = BindPhoneSuccess;
