const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/user-login/user-login');
const PhoneVerificationCode = require('../../component/mui/form/phone-verification-code.jsx');
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');
const getWeixinVersionInfo = require('../../helper/common-helper.js').getWeixinVersionInfo;
require('../../asset/style/style.scss');
require('../../component/order/customer-takeaway-info-editor.scss');
require('./application.scss');

const UserLoginApplication = React.createClass({
  displayName: 'UserLoginApplication',
  propTypes: {
    setErrorMsg: React.PropTypes.func,
    fetchVericationCode: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    login: React.PropTypes.func,
    loadingInfo: React.PropTypes.object,
  },
  componentDidMount() {
  },
  onGetVerificationCode(phoneNum) {
    this.props.fetchVericationCode(phoneNum);
  },
  onLogin() {
    const info = this.refs.verificationCode.getInputInfo();
    const { setErrorMsg, login } = this.props;
    if (!info.validation.valid) {
      setErrorMsg(info.validation.msg);
      return;
    }
    login(info.data);
  },
  onLoginWX() {
    this.props.login({ isWeixin: true });
  },
  clearErrorMessage() {
    this.props.setErrorMsg('');
  },
  render() {
    const { errorMessage, loadingInfo } = this.props;
    const weixinInfo = getWeixinVersionInfo();
    let weixinLoginElement = false;
    if (weixinInfo.weixin) {
      weixinLoginElement = (
        <div className="wx-login">
          <h3><span>选择第三方登录</span></h3>
          <button className="btn" onTouchTap={this.onLoginWX}>微信登录</button>
          <p>
            如果您已经有手机账号，使用微信登录后，请在【我 <br />的】界面b绑定手机号，以便关联原有账号
          </p>
        </div>);
    }
    return (
      <div>
        <PhoneVerificationCode
          onGetVerificationCode={this.onGetVerificationCode}
          ref="verificationCode"
        />
        <div>
          <button className="btn btn--yellow btn-login" onTouchTap={this.onLogin}>登录</button>
        </div>
        {weixinLoginElement}
        {errorMessage ? <Toast errorMessage={errorMessage} clearErrorMsg={this.clearErrorMessage} /> : false}
        {loadingInfo.ing ? <Loading word={loadingInfo.text} /> : false}
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(UserLoginApplication);
