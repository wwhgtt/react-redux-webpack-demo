const React = require('react');
const connect = require('react-redux').connect;
// const Toast = require('../../component/mui/toast.jsx');
const RegisterMember = require('../../component/register-member/register-member.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
import * as actions from '../../action/register-member/register-member.js';
const Toast = require('../../component/mui/toast.jsx');


const RegisterMemberApplication = React.createClass({
  propTypes: {
    // MapedActionsToProps
    userInfo: React.PropTypes.object,
    getUserInfo: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    setErrorMsg: React.PropTypes.func,
    saveRegisterMember: React.PropTypes.func,

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
    const { errorMessage, userInfo } = this.props;
    return (
      <div>
        <RegisterMember userInfo={userInfo} onRegisterMember={this.handleRegister} />
        {
          errorMessage ?
            <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(RegisterMemberApplication);
