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
    phoneCode: React.PropTypes.string,
    sendCode: React.PropTypes.func,

    // MapedStatesToProps
  },

  componentWillMount() {
    const { getUserInfo } = this.props;
    getUserInfo();
  },

  handleRegister(info) {
    this.props.setLoadMsg({ status: true, word: '注册中，请稍后……' });
    this.props.saveRegisterMember(info);
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  render() {
    const { errorMessage, userInfo, loadInfo, phoneCode, sendCode } = this.props;
    return (
      <div className="register-page">
        <RegisterMember
          userInfo={userInfo}
          onRegisterMember={this.handleRegister}
          registerPhoneCode={phoneCode}
          onSendCode={sendCode}
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
