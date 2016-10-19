const React = require('react');
const commonAction = require('../../action/common-action/common-action.js');
const connect = require('react-redux').connect;
const bindActionCreators = require('redux').bindActionCreators;

const PhoneVerficationCode = require('../../component/mui/form/phone-verification-code.jsx');
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const ActivateValidateApplication = React.createClass({
  displayName: 'RegisterValidateApplication',
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
    if (!phoneInfo.validation.valid) {
      setErrorMsg(phoneInfo.validation.msg);
      return;
    }

    checkBindCode(phoneInfo.data, this.hanleVipMobile, this.handleSuccessMobile, this.handleBoundMobile);
  },

  // 手机号是会员
  hanleVipMobile() {
    // console.log('是会员呀=======');
  },

  // 手机号可以正常注册
  handleSuccessMobile() {
    // console.log('可以注册哟=======');
  },

  // 手机号已和其他微信绑定
  handleBoundMobile() {
    // console.log('已和其他微信绑定=======');
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  render() {
    const { sendCode, errorMessage, loadInfo } = this.props;
    return (
      <div className="register-validate">
        <PhoneVerficationCode ref="verificationCode" onGetVerificationCode={sendCode} />
        <a className="btn--yellow" onTouchTap={this.onValidMobile}>确定</a>
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
