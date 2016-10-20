const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');
const commonAction = require('../../action/common-action/common-action.js');

require('../../asset/style/style.scss');
require('./application.scss');

const BindPhoneIndex = require('../../component/bind-account/bind-phone/bind-phone-index.jsx');
const BindPhoneValidate = require('../../component/bind-account/bind-phone/bind-phone-validate.jsx');
const BindPhoneSuccess = require('../../component/bind-account/bind-phone/bind-phone-success.jsx');


const BindPhoneApplication = React.createClass({
  displayName: 'BindPhoneApplication',
  propTypes: {
    // MapedActionsToProps
    setChildView: React.PropTypes.func,
    bindPhone: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    sendCode: React.PropTypes.func,
    loadInfo: React.PropTypes.object,
    setLoadMsg: React.PropTypes.func,
    checkBindCode: React.PropTypes.func,
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
    const { childView, errorMessage, setErrorMsg, sendCode, loadInfo, checkBindCode, bindPhone } = this.props;
    const phoneInfo = JSON.parse(sessionStorage.getItem('phoneInfo'));
    let bindSection;

    if (childView === '#phone-validate') {
      bindSection = (<BindPhoneValidate
        onBindPhone={this.handleBindPhone}
        setErrorMsg={setErrorMsg}
        sendCode={sendCode}
        checkBindCode={checkBindCode}
        bindPhone={bindPhone}
      />);
    } else if (childView === '#phone-success') {
      bindSection = <BindPhoneSuccess phoneInfo={phoneInfo} />;
    } else {
      bindSection = <BindPhoneIndex />;
    }
    return (
      <div className="bin-phone">
        {bindSection}
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

module.exports = connect(state => state, commonAction)(BindPhoneApplication);
