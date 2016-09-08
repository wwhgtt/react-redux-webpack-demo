const React = require('react');
const connect = require('react-redux').connect;
require('../../asset/style/style.scss');
require('./application.scss');
const actions = require('../../action/register-member/register-member.js');
const Toast = require('../../component/mui/toast.jsx');
const RegisterMember = require('../../component/register-member/register-member.jsx');
const Loading = require('../../component/mui/loading.jsx');

const RegisterMemberApplication = React.createClass({
  displayName: 'RegisterMemberApplication',
  propTypes: {
    // MapedActionsToProps
    userInfo: React.PropTypes.object,
    getUserInfo: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    setErrorMsg: React.PropTypes.func,
    saveRegisterMember: React.PropTypes.func,
    setLoadMsg: React.PropTypes.func,
    loadInfo: React.PropTypes.object,
    phoneFlag: React.PropTypes.bool,
    sendCode: React.PropTypes.func,
    checkCode: React.PropTypes.func,

    // MapedStatesToProps
  },

  componentWillMount() {
    const { getUserInfo } = this.props;
    getUserInfo();
  },

  handleRegister(info) {
    this.props.saveRegisterMember(info);
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  render() {
    const { errorMessage, userInfo, loadInfo, phoneFlag, sendCode, checkCode } = this.props;
    return (
      <div className="register-page">
        <RegisterMember
          userInfo={userInfo}
          onRegisterMember={this.handleRegister}
          isPhoneValid={phoneFlag}
          onSendCode={sendCode}
          onCheckCode={checkCode}
        />
        {
          errorMessage ?
            <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
        {
          loadInfo.status ?
            <Loading word={loadInfo.word} />
          : ''
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(RegisterMemberApplication);
