const React = require('react');
const commonAction = require('../../action/common-action/common-action.js');
const connect = require('react-redux').connect;
const bindActionCreators = require('redux').bindActionCreators;

const PhoneVerficationCode = require('../../component/mui/form/phone-verification-code.jsx');
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');

const getUrlParam = require('../../helper/common-helper.js').getUrlParam;

require('../../asset/style/style.scss');
require('./application.scss');

const returnUrl = getUrlParam('returnUrl') || '';
const shopId = getUrlParam('shopId');

const ActivateValidateApplication = React.createClass({
  displayName: 'ActivateValidateApplication',
  propTypes:{
    errorMessage: React.PropTypes.string,
    loadInfo: React.PropTypes.object,
    sendCode: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    checkBindCode: React.PropTypes.func,
  },

  onValidMobile() {
    const phoneInfo = this.refs.verificationCode.getInputInfo();
    const { checkBindCode, setErrorMsg } = this.props;
    const userMobile = {
      mobile: phoneInfo.data.phoneNum,
      code: phoneInfo.data.code,
      activation: 'memberCardActivate',
    };

    if (!phoneInfo.validation.valid) {
      setErrorMsg(phoneInfo.validation.msg);
      return;
    }

    checkBindCode(userMobile, this.hanleVipMobile, this.handleSuccessMobile, this.handleBoundMobile);
  },

  getPhoneInfo() {
    const phoneInfo = this.refs.verificationCode.getInputInfo();
    return phoneInfo.data;
  },

  // 手机号是会员
  hanleVipMobile() {
    const phoneNum = this.getPhoneInfo().phoneNum;
    location.href = `${decodeURIComponent(returnUrl)}&mobile=${phoneNum}`;
  },

  // 手机号可以正常注册
  handleSuccessMobile() {
    const phoneNum = this.getPhoneInfo().phoneNum;
    location.href =
      `http://${location.host}/member/register?shopId=${shopId}&mobile=${phoneNum}&returnUrl=${returnUrl}&activation=memberCardActivate`;
  },

  // 手机号已和其他微信绑定
  handleBoundMobile() {
    this.props.setErrorMsg('该手机号已与其它微信号绑定过，请在对应微信号内或使用其他手机号激活');
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  render() {
    const { sendCode, errorMessage, loadInfo } = this.props;
    return (
      <div className="phone-validate">
        <PhoneVerficationCode ref="verificationCode" onGetVerificationCode={sendCode} />
        <a className="btn btn--yellow btn-validate" onTouchTap={this.onValidMobile}>确定</a>
        {
          errorMessage && <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
        }
        {
          loadInfo.status && <Loading word={loadInfo.word} />
        }
      </div>
    );
  },
});

const mapStateToProps = function getPropFromState(state) {
  return {
    errorMessage: state.errorMessage,
    loadInfo: state.loadInfo,
    timestamp: state.timestamp,
  };
};

const mapDispatchToProps = function getPropsFromAction(dispatch) {
  const actionObj = Object.assign({}, commonAction);
  return bindActionCreators(actionObj, dispatch);
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ActivateValidateApplication);
