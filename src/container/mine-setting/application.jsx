const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-setting.js');
require('../../asset/style/style.scss');
require('./application.scss');

const ShowSettingList = require('../../component/mine/show-setting-list.jsx');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');

const MineSettingApplication = React.createClass({
  displayName: 'MineSettingApplication',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    updateInfo:React.PropTypes.func,
    load:React.PropTypes.object,
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
  onSave(condition) {
    // 保存
    this.setState({ load : true });
    const { updateInfo } = this.props;
    const { name, sex } = this.state;
    updateInfo(name, sex, condition);
  },
  getInfo(obj) {
    this.setState({ name:obj.name, sex:obj.sex });
  },
  render() {
    let condition = '';// 1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
    const { info, logOff, clearErrorMsg, errorMessage, load } = this.props;
    // 几种状态的判断
    if (info.loginType === 1 && !info.bindMobile) {
      condition = 1;
    }
    return (
      <div className="application">
        {
          load.status ?
            <Loading word={load.word} />
          :
            false
        }
        <div className="scroll-part">
          <ShowSettingList info={info} getInfo={this.getInfo} logOff={logOff} />
        </div>
        <a href=" javascript:void(0);" className="btn-row btn-row-sure btn-ab" onTouchTap={() => this.onSave(condition)}>保存</a>
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
