const React = require('react');
const connect = require('react-redux').connect;
const bindActionCreators = require('redux').bindActionCreators;
const commonAction = require('../../action/common-action/common-action.js');

const ActivateSuccess = require('../../component/activate-card/activate-success.jsx');
const ActivateBound = require('../../component/activate-card/activate-bound.jsx');
const ActivateValid = require('../../component/activate-card/activate-valid.jsx');

require('../../asset/style/style.scss');
require('./application.scss');
const kryPic = require('../../asset/images/kry_logo.png');

const ActivateCardApplication = React.createClass({
  displayName: 'ActivateCardApplication',
  propTypes: {
    childView: React.PropTypes.string,
    setChildView: React.PropTypes.func,
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

  render() {
    const { childView } = this.props;

    let showSection = '';
    if (childView === '#activate-bound') {
      showSection = <ActivateBound />;
    } else if (childView === '#activate-valid') {
      showSection = <ActivateValid />;
    } else {
      showSection = <ActivateSuccess />;
    }
    return (
      <div className="activate-card flex-columns">
        {showSection}
        <div className="copyright-footer flex-none">
          <span>powered by </span>
          <img src={kryPic} role="presentation" />
        </div>
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

const mapDispatchToProps = function (dispatch) {
  const actionObj = Object.assign({}, commonAction);
  return bindActionCreators(actionObj, dispatch);
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(ActivateCardApplication);
