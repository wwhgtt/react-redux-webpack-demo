const React = require('react');
const PhoneVerficationCode = require('../../mui/form/phone-verification-code.jsx');
const getUrlParam = require('../../../helper/common-helper.js').getUrlParam;
const shopId = getUrlParam('shopId');


const BindPhoneValidate = React.createClass({
  displayName:'BindPhoneValidate',
  propTypes:{
    setErrorMsg: React.PropTypes.func,
    sendCode: React.PropTypes.func,
    checkBindCode: React.PropTypes.func,
    bindPhone: React.PropTypes.func,
  },

  getPhoneInfo() {
    const phoneInfo = this.refs.verificationCode.getInputInfo();
    return phoneInfo.data;
  },

  handleBindAccount(e) {
    const phoneInfo = this.refs.verificationCode.getInputInfo();
    const { checkBindCode, setErrorMsg } = this.props;
    const userMobile = {
      mobile: phoneInfo.data.phoneNum,
      code: phoneInfo.data.code,
    };

    if (!phoneInfo.validation.valid) {
      setErrorMsg(phoneInfo.validation.msg);
      return;
    }
    checkBindCode(userMobile, this.hanleVipMobile, this.handleSuccessMobile, this.handleBoundMobile);
  },

  // 手机号是会员
  hanleVipMobile() {
    const { bindPhone } = this.props;
    const info = this.getPhoneInfo();
    bindPhone(info, this.handleSuccessBind);
  },

  // 手机号可以正常绑定
  handleSuccessMobile() {
    const { bindPhone } = this.props;
    const info = this.getPhoneInfo();
    bindPhone(info, this.handleSuccessBind);
  },

  // 绑定成功
  handleSuccessBind() {
    const phoneInfo = this.getPhoneInfo();
    const bindPhoneInfo = { phoneNum: phoneInfo.phoneNum, phoneShopId: shopId };
    sessionStorage.setItem('phoneInfo', JSON.stringify(bindPhoneInfo));
    location.hash = '#phone-success';
  },

  // 手机号已和其他微信绑定
  handleBoundMobile() {
    this.props.setErrorMsg('该手机号已与其他微信号绑定，请使用其他手机号绑定');
  },

  render() {
    const { sendCode } = this.props;
    return (
      <div className="bind-phone-validate">
        <PhoneVerficationCode ref="verificationCode" onGetVerificationCode={sendCode} />
        <a className="btn btn--yellow btn-bind" onClick={this.handleBindAccount}>绑定手机号</a>
      </div>
    );
  },
});

module.exports = BindPhoneValidate;
