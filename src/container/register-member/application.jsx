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
    sendCode: React.PropTypes.func,
    checkCode: React.PropTypes.func,
    phoneCode: React.PropTypes.string,

    // MapedStatesToProps
  },
  getInitialState() {
    return {
      userInfo: {},
    };
  },

  componentWillMount() {
    const { getUserInfo } = this.props;
    getUserInfo();
  },

  handleRegister(info) {
    this.props.saveRegisterMember(info);
    this.setState({ userInfo: info });
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },


  handleCheckCode(phoneInfo) {
    const userInfo = this.state.userInfo;
    this.props.checkCode(phoneInfo, userInfo);
  },

  handleGetRegisterInfo(registerInfo) {
    this.setState({ userInfo: registerInfo });
  },

  render() {
    const { errorMessage, userInfo, loadInfo, sendCode, phoneCode } = this.props;
    return (
      <div className="application">
        <RegisterMember
          userInfo={userInfo}
          registerPhoneCode={phoneCode}
          onRegisterMember={this.handleRegister}
          onSendCode={sendCode}
          onCheckCode={this.handleCheckCode}
          onGetRegisterInfo={this.handleGetRegisterInfo}
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
