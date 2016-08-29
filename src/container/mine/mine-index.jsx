const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-index.js');
const ShowBasicInfo = require('../../component/mine/ShowBasicInfo.jsx');
const ShowMenuList = require('../../component/mine/ShowMenuList.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./mine-index.scss');

const MineIndexApplication = React.createClass({
  displayName: 'MineIndexApplication',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  render() {
    const { info, clearErrorMsg, errorMessage } = this.props;
    return (
      <div>
        <ShowBasicInfo info={info} />
        <ShowMenuList />
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
