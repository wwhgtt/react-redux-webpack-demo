const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-index.js');
const ShowBasicInfo = require('../../component/mine/show-basic-info.jsx');
const ShowMenuList = require('../../component/mine/show-menu-list.jsx');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const MineIndexApplication = React.createClass({
  displayName: 'MineIndexApplication',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    load:React.PropTypes.object,
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
    const { info, clearErrorMsg, errorMessage, load } = this.props;
    return (
      <div className="application">
        {
          load.status ?
            <Loading word={load.word} />
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
