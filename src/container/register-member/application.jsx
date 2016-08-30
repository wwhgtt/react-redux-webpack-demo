const React = require('react');
const connect = require('react-redux').connect;
// const Toast = require('../../component/mui/toast.jsx');
const RegisterMember = require('../../component/register-member/register-member.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

// import * as actions from '../../action/register-member/register-member.js';


const RegisterMemberApplication = React.createClass({
  // 监听hash变化
  componentWillMount() {

  },

  render() {
    return (
      <RegisterMember />
    );
  },
});

module.exports = connect()(RegisterMemberApplication);
