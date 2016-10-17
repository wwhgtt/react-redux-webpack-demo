const React = require('react');
const commonAction = require('../../action/common-action/common-action.js');
const connect = require('react-redux').connect;
const bindActionCreators = require('redux').bindActionCreators;
const PhoneVerficationCode = require('../../component/mui/form/phone-verification-code.jsx');
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

const RegisterValidateApplication = React.createClass({
  displayName: 'RegisterValidateApplication',
  propTypes:{
    sendCode: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
  },

  render() {
    const { sendCode, errorMessage } = this.props;
    return (
      <div className="register-validate">
        <PhoneVerficationCode ref="verificationCode" onGetVerificationCode={sendCode} />
        <a className="btn--yellow">确定</a>
        {
          errorMessage && <Toast errorMessage={errorMessage} />
        }
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    errorMessage: state.errorMessage,
    loadInfo: state.loadInfo,
    timestamp: state.timestamp,
  };
};

const mapDispatchToProps = function (dispatch) {
  const actionObj = Object.assign({}, commonAction);
  return bindActionCreators(actionObj, dispatch);
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(RegisterValidateApplication);
