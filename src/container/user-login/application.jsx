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
    errorMessage: React.PropTypes.string,
    phoneNum: React.PropTypes.string,
    loadingInfo: React.PropTypes.object,
    supportInfo: React.PropTypes.object,
    setErrorMsg: React.PropTypes.func,
    fetchVericationCode: React.PropTypes.func.isRequired,
    fetchLoginPhone: React.PropTypes.func.isRequired,
    fetchSupportInfo: React.PropTypes.func.isRequired,
    login: React.PropTypes.func,
  },
  componentDidMount() {
    const { fetchLoginPhone, fetchSupportInfo } = this.props;
    fetchLoginPhone();
    fetchSupportInfo();
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
    const { errorMessage, loadingInfo, supportInfo, phoneNum } = this.props;
    const weixinInfo = getWeixinVersionInfo();
    let weixinLoginElement = false;
    if (weixinInfo.weixin && supportInfo.weixin) {
      weixinLoginElement = (
        <div className="wx-login">
          <h3><span>第三方登录</span></h3>
          <a className="btn" onTouchTap={this.onLoginWX}></a>
          <div className="wx-login-tips">
            <p>
            如已有手机注册账号，选择微信登录后，
            </p>
            <p>请在用户中心绑定手机号，以便关联原有账户信息</p>
          </div>
        </div>);
    }
    return (
      <div className="application flex-columns">
        <div className="login-content">
          <div className="login-head">
            <div className="login-head-img"></div>
            <div className="login-head-tips">
              <p>初次见面，</p>
              <p>客官还需验证唷～</p>
            </div>
          </div>
          <PhoneVerificationCode
            hasForeignZone={supportInfo.xiangEQ}
            onGetVerificationCode={this.onGetVerificationCode}
            ref="verificationCode"
            phoneNum={phoneNum || ''}
          />
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
