const React = require('react');
const PhoneVerficationCode = require('../mui/phone-verification-code.jsx');

const BindPhoneValidate = React.createClass({
  propTypes:{
    onBindPhone: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
  },

  getInitialState() {
    return {
    };
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
    return (
      <div>
        <div>
          <PhoneVerficationCode ref="verificationCode" />
          <a className="btn btn--yellow" onClick={this.handleBindAccount}>绑定手机号</a>
        </div>
      </div>
    );
  },
});

module.exports = BindPhoneValidate;
