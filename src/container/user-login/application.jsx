const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/user-login/user-login');
const PhoneVerificationCode = require('../../component/mui/phone-verification-code.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('../../component/order/customer-takeaway-info-editor.scss');
require('./application.scss');

const UserLoginApplication = React.createClass({
  displayName: 'UserLoginApplication',
  propTypes: {
    setErrorMsg: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    login: React.PropTypes.func,
  },
  getInitialState() {
    return { phoneNum: '', code: '', isForeignZone: false };
  },
  componentDidMount() {
  },
  componentWillReceiveProps(newProps) {
  },
  handleInputInfoChange(info) {
    this.setState(info);
  },
  handleLoginBtnTouchTap() {
    const { phoneNum, code, isForeignZone } = this.state;
    const { setErrorMsg, login } = this.props;
    const info = {};
    if (!phoneNum) {
      setErrorMsg('请输入手机号');
      return;
    }

    const regPhoneNum = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/;
    if (!regPhoneNum.test(phoneNum)) {
      setErrorMsg('请输入正确的手机号');
      return;
    }

    info.phoneNum = phoneNum;
    if (!isForeignZone) {
      if (!code) {
        setErrorMsg('请输入验证码');
        return;
      }

      if (!/^\d{4}$/.test(code)) {
        setErrorMsg('请输入正确的验证码');
        return;
      }
      info.code = code;
    }

    login(info);
  },
  clearErrorMessage() {
    this.props.setErrorMsg('');
  },
  render() {
    const { errorMessage } = this.props;
    const nations = [
      { text: '中国', value: 'China' },
      { text: '澳大利亚', value: 'Australia' },
    ];
    return (
      <div>
        <PhoneVerificationCode nations={nations} onInputInfoChange={this.handleInputInfoChange} />
        <div>
          <button className="btn btn--yellow btn-login" onTouchTap={this.handleLoginBtnTouchTap}>登录</button>
        </div>
        <div className="wx-login">
          <h3><span>选择第三方登录</span></h3>
          <button className="btn">
            微信登录
          </button>
          <p>
            如果您已经有手机账号，使用微信登录后，请在【我 <br />的】界面b绑定手机号，以便关联原有账号
          </p>
        </div>
        {
          errorMessage ? <Toast errorMessage={errorMessage} clearErrorMsg={this.clearErrorMessage} /> : false
        }
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(UserLoginApplication);
