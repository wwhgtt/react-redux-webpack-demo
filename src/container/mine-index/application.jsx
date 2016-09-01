const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-index.js');
const ShowBasicInfo = require('../../component/mine/ShowBasicInfo.jsx');
const ShowMenuList = require('../../component/mine/ShowMenuList.jsx');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const MineIndexApplication = React.createClass({
  displayName: 'MineIndexApplication',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
  },
  getInitialState() {
    return { load : true ,word : '加载中' };
  },
  componentWillMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  componentWillReceiveProps(nextProps) {   // 接收props
    this.setState({ load : false });
  },
  render() {
    const { info, clearErrorMsg, errorMessage } = this.props;
    const { load, word } = this.state;
    return (
      <div>
        {
          load ?
            <Loading word={word} />
          :
            false
        }
        <ShowBasicInfo info={info} />
        <ShowMenuList info={info} />
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

module.exports = connect(state => state, actions)(MineIndexApplication);
