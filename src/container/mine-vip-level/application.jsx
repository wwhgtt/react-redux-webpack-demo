const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-vip-level.js');
require('../../asset/style/style.scss');

const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const ShowVipProcess = require('../../component/mine/show-vip-process.jsx');
const VipCurrentLevel = require('../../component/mine/get-vip-current-level.jsx');

require('./application.scss');

const MineVipLevelApplication = React.createClass({
  displayName: 'MineVipLevelApplication',
  propTypes:{
    getInfo:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
    load:React.PropTypes.object,
    grownLevelInfo:React.PropTypes.object.isRequired,
    userInfo:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return { switchIndex:-1 };
  },
  componentWillMount() {},
  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  getIndex(index) {
    this.setState({ switchIndex:index });
  },
  render() {
    const { errorMessage, clearErrorMsg, load, grownLevelInfo } = this.props;
    const { switchIndex } = this.state;
    return (
      <div className="application">
        <ShowVipProcess grownLevelInfo={grownLevelInfo} getIndex={this.getIndex} />
        <VipCurrentLevel grownLevelInfo={grownLevelInfo} switchIndex={switchIndex} />
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
        <div className="copyright"></div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipLevelApplication);
