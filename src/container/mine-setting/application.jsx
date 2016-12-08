const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-setting.js');
require('../../asset/style/style.scss');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const InputDate = require('../../component/mui/form/date-select.jsx');
const ShowSettingList = require('../../component/mine/show-setting-list.jsx');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
require('./application.scss');

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
    return { name:'', sex:'', isShow:false, birthDay:'' };
  },
  componentWillMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  componentDidMount() {},
  onSave(condition) {
    // 保存
    this.setState({ load : true });
    const { updateInfo, info } = this.props;
    const { name, sex, birthDay } = this.state;
    let birthData = info.birthday || birthDay;
    updateInfo(name, sex, condition, birthData);
  },
  getInfo(obj) {
    this.setState({ name:obj.name, sex:obj.sex });
  },
  handleCancelDate() {
    this.setState({ isShow: false });
  },
  handleCompleteDate(obj) {
    this.setState({ birthDay: dateUtility.format(obj.text, 'yyyy-MM-dd'), isShow: false });
  },
  showBirthdaySelect() {
    this.setState({ isShow: true });
  },
  render() {
    let condition = ''; // 1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
    const { info, logOff, clearErrorMsg, errorMessage, load } = this.props;
    const currentY = new Date().getFullYear();
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
          <ShowSettingList
            info={this.state.birthDay ? Object.assign({}, info, { updatedBirthday:this.state.birthDay }) : info}
            getInfo={this.getInfo}
            showBirthdaySelect={this.showBirthdaySelect}
            logOff={logOff}
            onSave={() => this.onSave(condition)}
          />
        </div>
        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {this.state.isShow ?
            <InputDate
              startYear={currentY - 120}
              endYear={currentY}
              date={info.birthday || '2012-08-15'}
              isAllowExceedNow={false}
              onCancelDateSelect={this.handleCancelDate}
              onCompleteDateSelect={this.handleCompleteDate}
            /> : false
          }
        </ReactCSSTransitionGroup>
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

module.exports = connect(state => state, actions)(MineSettingApplication);
