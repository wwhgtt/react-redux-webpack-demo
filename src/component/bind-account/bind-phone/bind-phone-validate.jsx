const React = require('react');
const PhoneVerficationCode = require('../../mui/form/phone-verification-code.jsx');

const BindPhoneValidate = React.createClass({
  displayName:'BindPhoneValidate',
  propTypes:{
    onBindPhone: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    sendCode: React.PropTypes.func,
  },

  handleBindAccount(e) {
    const phoneInfo = this.refs.verificationCode.getInputInfo();
    const { onBindPhone, setErrorMsg } = this.props;
    if (!phoneInfo.validation.valid) {
      setErrorMsg(phoneInfo.validation.msg);
      return;
    }
    onBindPhone(phoneInfo.data);
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
