const React = require('react');
const config = require('../../../config');
const getUrlParam = require('../../../helper/common-helper.js').getUrlParam;
const returnUrl = getUrlParam('returnUrl') || '';

const BindPhoneSuccess = React.createClass({
  displayName:'BindPhoneSucess',
  propTypes: {
    phoneInfo: React.PropTypes.object.isRequired,
  },

  // 3秒后跳转到相关页面
  componentDidMount() {
    const shopId = this.props.phoneInfo.phoneShopId;
    let displayUrl = '';
    if (returnUrl) {
      displayUrl = decodeURIComponent(returnUrl);
    } else {
      displayUrl = `${config.mineIndexURL}?shopId=${shopId}`;
    }
    setTimeout(() => {
      location.href = displayUrl;
    }, 3000);
  },

  render() {
    return (
      <div className="bind-account mt-40">
        <div className="phone-img-green"></div>
        <div className="account-info">
          <div className="account-info-current">当前绑定的手机号</div>
          <span className="account-info-userName">{this.props.phoneInfo.phoneNum}</span>
          <p className="mt-20">跳转中……</p>
        </div>
      </div>

    );
  },
});

module.exports = BindPhoneSuccess;
