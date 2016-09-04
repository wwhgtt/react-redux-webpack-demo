const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
const actions = require('../../action/bind-account/bind-phone.js');
require('../../asset/style/style.scss');
require('./application.scss');

const BindPhoneIndex = require('../../component/bind-account/bind-phone/bind-phone-index.js');
const BindPhoneValidate = require('../../component/bind-account/bind-phone/bind-phone-validate.js');
const BindPhoneSuccess = require('../../component/bind-account/bind-phone/bind-phone-success.js');

const BindPhoneApplication = React.createClass({
  displayName: 'BindPhoneApplication',
  propTypes: {
    // MapedActionsToProps
    setChildView: React.PropTypes.func,
    bindPhone: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    sendCode: React.PropTypes.func,
    // MapedStatesToProps
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    phoneNum: React.PropTypes.string,
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
    const { childView, bindPhone, errorMessage, setErrorMsg, sendCode } = this.props;
    const phoneNum = sessionStorage.getItem('phoneNum');
    let bindSection;

    if (childView === '#phone-validate') {
      bindSection = (<BindPhoneValidate
        onBindPhone={phoneInfo => bindPhone(phoneInfo)}
        setErrorMsg={setErrorMsg}
        sendCode={sendCode}
      />);
    } else if (childView === '#phone-success') {
      bindSection = <BindPhoneSuccess phoneNum={phoneNum} />;
    } else {
      bindSection = <BindPhoneIndex />;
    }
    return (
      <div>
        {bindSection}
        {
          errorMessage ?
            <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(BindPhoneApplication);
