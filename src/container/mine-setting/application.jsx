const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-setting.js');
const ShowSettingList = require('../../component/mine/ShowSettingList.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const MineSettingApplication = React.createClass({
  displayName: 'MineSettingApplication',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    updateInfo:React.PropTypes.func,
    logOff:React.PropTypes.func,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
  },
  getInitialState() {
    return { name:'', sex:'' };
  },
  componentWillMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  componentDidMount() {},
  onSave() {
    // 保存
    const { updateInfo } = this.props;
    const { name, sex } = this.state;
    updateInfo(name, sex);
  },
  getInfo(obj) {
    this.setState({ name:obj.name, sex:obj.sex });
  },
  render() {
    const { info, logOff, clearErrorMsg, errorMessage } = this.props;
    return (
      <div>
        <div className="scroll-part">
          <ShowSettingList info={info} getInfo={this.getInfo} logOff={logOff} />
        </div>
        <a href=" javascript:void(0);" className="btn-row btn-row-sure btn-ab" onTouchTap={this.onSave}>保存</a>
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

module.exports = connect(state => state, actions)(MineSettingApplication);
