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
    return {};
  },
  componentDidMount() {
  },
  componentWillReceiveProps(newProps) {
  },
  handleLoginBtnTouchTap() {
    const info = this.refs.verificationCode.getInputInfo();
    const { setErrorMsg, login } = this.props;
    if (!info.validation.valid) {
      setErrorMsg(info.validation.msg);
      return;
    }
    login(info.data);
  },
  clearErrorMessage() {
    this.props.setErrorMsg('');
  },
  render() {
    const { errorMessage } = this.props;
    return (
      <div>
        <PhoneVerificationCode ref="verificationCode" hasForeignZone />
        <div>
          <button className="btn btn--yellow btn-login" onTouchTap={this.handleLoginBtnTouchTap}>登录</button>
        </div>
        <div className="wx-login">
          <h3><span>选择第三方登录</span></h3>
          <button className="btn">微信登录</button>
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
