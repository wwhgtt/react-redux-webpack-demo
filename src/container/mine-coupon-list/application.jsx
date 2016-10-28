const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-vip-level.js');
require('../../asset/style/style.scss');
require('./application.scss');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');

const MineVipLevelApplication = React.createClass({
  displayName: 'MineVipLevelApplication',
  propTypes:{
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
    load:React.PropTypes.object,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  render() {
    const { errorMessage, clearErrorMsg, load } = this.props;
    return (
      <div className="application">
      123
        {
          load.status ?
            <Loading word={load.word} />
          :
            false
        }
        {
        errorMessage ?
          <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />
        :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipLevelApplication);
