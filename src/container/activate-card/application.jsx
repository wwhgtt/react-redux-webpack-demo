const React = require('react');
const connect = require('react-redux').connect;
const commonAction = require('../../action/common-action/common-action.js');

const Toast = require('../../component/mui/toast.jsx');
const ActivateSuccess = require('../../component/activate-card/activate-success.jsx');
const ActivateBound = require('../../component/activate-card/activate-bound.jsx');
const ActivateValid = require('../../component/activate-card/activate-valid.jsx');
const ActivateFaild = require('../../component/activate-card/activate-faild.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const ActivateCardApplication = React.createClass({
  displayName: 'ActivateCardApplication',
  propTypes: {
    childView: React.PropTypes.string,
    setChildView: React.PropTypes.func,
    bindWX: React.PropTypes.func,
    logout: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
  },

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
    const { childView, bindWX, logout, setErrorMsg, errorMessage } = this.props;

    let showSection = '';
    if (childView === '#activate-bound') {
      showSection = <ActivateBound onLogout={logout} setErrorMsg={setErrorMsg} />;
    } else if (childView === '#activate-valid') {
      showSection = <ActivateValid onBindWx={bindWX} onLogout={logout} setErrorMsg={setErrorMsg} />;
    } else if (childView === '#activate-faild') {
      showSection = <ActivateFaild />;
    } else if (childView === '#activate-success') {
      showSection = <ActivateSuccess />;
    } else {
      return false;
    }
    return (
      <div className="activate-card flex-columns">
        {showSection}
        <div className="copyright flex-none">
        </div>
        {
          errorMessage && <Toast errorMessage={errorMessage} clearErrorMsg={this.handleClearErrorMsg} />
        }
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    errorMessage: state.errorMessage,
    loadInfo: state.loadInfo,
    childView: state.childView,
  };
};

module.exports = connect(mapStateToProps, commonAction)(ActivateCardApplication);
