const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
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
    setErrorMsg: React.PropTypes.func,
    // states
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
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

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  render() {
    const { childView, bindPhone, errorMessage, setErrorMsg } = this.props;
    let phoneNum = '';
    let wxInfo = {
      phoneNum: '13498000384',
      userName: '黎逝33',
    };
    return (
      <div>
        { // 手机绑定首页
          childView === '#bind-phone' ?
            <BindPhoneIndex />
          : false
        }
        { // 验证手机
          childView === '#phone-validate' ?
            <BindPhoneValidate
              onBindPhone={phoneInfo => bindPhone(phoneInfo)}
              setErrorMsg={setErrorMsg}
            />
          : false
        }
        { // 手机绑定成功
          childView === '#phone-success' ?
            <BindPhoneSuccess phoneNum={phoneNum} />
          : false
        }
        { // 微信绑定首页
          childView === '#bind-wx' ?
            <BindWxIndex />
          : false
        }
        { // 微信信息展示
          childView === '#wx-info' ?
            <BindWxInfo wxInfo={wxInfo} />
          : false
        }
        { // 微信绑定成功
          childView === '#wx-success' ?
            <BindWxSuccess />
          : false
        }
        {
          errorMessage ?
            <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(BindAccountApplication);
