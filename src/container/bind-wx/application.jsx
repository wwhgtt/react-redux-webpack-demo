const React = require('react');
const connect = require('react-redux').connect;
const Toast = require('../../component/mui/toast.jsx');
const actions = require('../../action/bind-account/bind-wx.js');
require('../../asset/style/style.scss');
require('./application.scss');

const BindWxIndex = require('../../component/bind-account/bind-wx/bind-wx-index.js');
const BindWxInfo = require('../../component/bind-account/bind-wx/bind-wx-info.js');
const BindWxSuccess = require('../../component/bind-account/bind-wx/bind-wx-success.js');


const BindWXApplication = React.createClass({
  displayName: 'BindWXApplication',
  propTypes: {
    // MapedActionsToProps
    setChildView: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    wxInfo: React.PropTypes.object,
    getOpenId: React.PropTypes.func,
    getWXInfo: React.PropTypes.func,
    bindWX: React.PropTypes.func,
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
    const { childView, errorMessage, getOpenId, wxInfo, getWXInfo, bindWX } = this.props;
    let bindSection;

    if (childView === '#wx-info') {
      bindSection = <BindWxInfo wxInfo={wxInfo} onGetWXInfo={getWXInfo} onBindWX={bindWX} />;
    } else if (childView === '#wx-success') {
      bindSection = <BindWxSuccess />;
    } else {
      bindSection = <BindWxIndex onGetOpenId={getOpenId} />;
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

module.exports = connect(state => state, actions)(BindWXApplication);
