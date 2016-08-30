const React = require('react');
const connect = require('react-redux').connect;
// const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
const BindPhoneIndex = require('../../component/bind-account/bind-phone-index.js');
const BindPhoneValidate = require('../../component/bind-account/bind-phone-validate.js');
const BindPhoneSuccess = require('../../component/bind-account/bind-phone-success.js');
const BindWxIndex = require('../../component/bind-account/bind-wx-index.js');
const BindWxInfo = require('../../component/bind-account/bind-wx-info.js');
const BindWxSuccess = require('../../component/bind-account/bind-wx-success.js');
const actions = require('../../action/bind-account/bind-account.js');


const BindAccountApplication = React.createClass({
  propTypes: {
    // actions
    setChildView: React.PropTypes.func,
    bindPhone: React.PropTypes.func,
    // states
    childView: React.PropTypes.string,
  },
  // 监听hash变化
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
  },

  // 获得页面hash并发送action
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },

  render() {
    const { childView, bindPhone } = this.props;
    let phoneNum = '';
    let wxInfo = {
      phoneNum: '13498000384',
      userName: '黎逝33',
    };
    switch (childView) {
      case '#bind-phone':
        // 手机绑定首页
        return <BindPhoneIndex />;
      case '#phone-validate':
        // 验证手机
        return (
          <BindPhoneValidate
            onBindPhone={phoneInfo => bindPhone(phoneInfo)}
          />
        );
      case '#phone-success':
        phoneNum = window.sessionStorage.getItem('phoneNum');
        // 手机绑定成功
        return <BindPhoneSuccess phoneNum={phoneNum} />;
      case '#bind-wx':
        // 微信绑定首页
        return <BindWxIndex />;
      case '#wx-info':
        // 微信信息展示
        return <BindWxInfo wxInfo={wxInfo} />;
      case '#wx-success':
        return <BindWxSuccess />;
      default:
        return <div></div>;
    }
  },
});

module.exports = connect(state => state, actions)(BindAccountApplication);
