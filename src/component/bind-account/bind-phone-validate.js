const React = require('react');
const PhoneVerficationCode = require('../mui/phone-verification-code.jsx');
const Toast = require('../mui/toast.jsx');

const BindPhoneValidate = React.createClass({
  propTypes:{
    onBindPhone: React.PropTypes.func,
  },
  getInitialState() {
    return {
      showMsg: false,
      phoneNum: '',
      phoneCode: '',
    };
  },

  handleClearErrorMsg() {
    this.setState({ showMsg: false });
  },

  handleClick(e) {
    const { phoneNum, phoneCode } = this.state || {};
    // console.log(this.state);
    if (!phoneNum) {
      this.setState({ showMsg: true });
      return;
    }

    this.props.onBindPhone({ phoneNum, phoneCode });
  },

  handleChange(obj) {
    this.setState({ phoneCode: obj.code, phoneNum: obj.phoneNum });
  },

  render() {
    return (
      <div>
        <form className="">
          <div>
            <PhoneVerficationCode onVerificationCodeChange={this.handleChange} />
            <a className="btn btn--yellow" onClick={this.handleClick}>绑定手机号</a>
          </div>
        </form>
          {
            this.state.showMsg ?
              <Toast errorMessage="请填写电话号码" clearErrorMsg={this.handleClearErrorMsg} />
            : ''
          }
      </div>
    );
  },
});

module.exports = BindPhoneValidate;
