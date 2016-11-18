const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/register-member/register-member.js');
const helper = require('../../helper/common-helper.js');
const replaceEmojiWith = helper.replaceEmojiWith;

const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');
const InputNum = require('../../component/mui/form/input/input-number.js');
const InputDate = require('../../component/mui/form/date-select.jsx');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const SexSwitch = require('../../component/common/sex-switch.jsx');

const mobile = helper.getUrlParam('mobile');

require('../../asset/style/style.scss');
require('./application.scss');

const RegisterMemberApplication = React.createClass({
  displayName: 'RegisterMemberApplication',
  propTypes: {
    // MapedActionsToProps
    userInfo: React.PropTypes.object,
    getUserInfo: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
    setErrorMsg: React.PropTypes.func,
    saveRegisterMember: React.PropTypes.func,
    setLoadMsg: React.PropTypes.func,
    loadInfo: React.PropTypes.object,

    // MapedStatesToProps
  },
  getInitialState() {
    return {
      birthDay: '',
      password: '',
      userSex: '-1',
      userName: '',
    };
  },

  componentWillMount() {
    const { getUserInfo } = this.props;
    getUserInfo();
  },

  componentWillReceiveProps(nextProps) {
    const { userInfo, errorMessage } = nextProps;
    this.setState({
      errorMSG: errorMessage,
    });
    if (this._isPropsFirstLoad) {
      return;
    }

    this._isPropsFirstLoad = true;
    this.setState({
      userSex: userInfo.sex,
      userName: userInfo.name || '',
    });
  },

  // 获取密码
  setPassword(obj) {
    this.setState({ errorMsgC: obj.errorMsg, password: obj.numVal });
  },

  handleGetRegisterInfo(registerInfo) {
    this.setState({ userInfo: registerInfo });
  },

  // 获取性别
  handleSex(obj) {
    this.setState({ userSex: obj.sex });
  },

  // 获取姓名
  handleName(e) {
    let nameVal = e.target.value;
    this.setState({ userName: nameVal });
  },

  // 取消、隐藏日历
  handleCancelDate() {
    this.setState({ isShow: false });
  },

  // 选择日期、隐藏日历
  handleCompleteDate(obj) {
    this.setState({ birthDay: obj.text, isShow: false });
  },

  // 注册会员
  registerMember() {
    const {
      errorMsgC,
      password,
      userSex,
      birthDay,
      userName,
    } = this.state;
    const userNameValid = replaceEmojiWith(userName.trim());
    if (!userNameValid) {
      this.setState({ errorMSG: '请填写姓名' });
    } else if (!(userSex === '0' || userSex === '1')) {
      this.setState({ errorMSG: '请选择性别' });
    } else if (!birthDay) {
      this.setState({ errorMSG: '请选择出生日期' });
    } else if (!password) {
      this.setState({ errorMSG: '请填写交易密码' });
    } else if (errorMsgC) {
      this.setState({ errorMSG: errorMsgC });
    } else {
      const registerInfo = {
        name: userNameValid,
        birth: birthDay,
        mobile: this.phonNum,
        sex: userSex,
        pwd: password,
      };
      // this.props.onGetRegisterInfo(registerInfo);
      this.props.saveRegisterMember(registerInfo);
    }
  },

  handleClearErrorMsg() {
    this.setState({ errorMSG: '' });
  },

  render() {
    const { userInfo, loadInfo } = this.props;
    const { birthDay, userSex, password, errorMSG } = this.state;
    // const regEmpty = /\S/; // 非空验证规则
    const regCode = /\d{6}/; // 6位数字验证规则

    // 6位密码验证
    const regC = [
      // { regMsg: '密码空的', reg: regEmpty },
      { regMsg: '请输入6位密码', reg: regCode },
    ];
    const currentY = new Date().getFullYear();

    if (mobile) {
      this.phonNum = mobile;
    } else {
      this.phonNum = userInfo.mobile;
    }
    return (
      <div className="application">
        <div className="flex-columns">
          <div className="register-member flex-rest">
            <div className="register-banner">
              <img className="register-banner-img" alt="" src={userInfo.picUrl} />
            </div>
            <div className="">
              <div className="options-group">
                <div className="option">
                  <span className="option-title">手机号</span>
                  <span className={'option-input register-input'}>{this.phonNum}</span>
                </div>
              </div>

              <div className="options-group">
                <div className="option register-user">
                  <span className="option-title register-user-name">姓名</span>
                  <SexSwitch sex={userSex} changeSex={this.handleSex} />
                  <input
                    type="text"
                    className="option-input register-input register-user-input"
                    placeholder="请填写姓名"
                    maxLength="30"
                    onChange={this.handleName}
                  />
                </div>
                <div className="option">
                  <span className="option-title">生日</span>
                  <span className="btn-arrow-right"></span>
                  <input
                    type="text"
                    className="option-input register-input"
                    placeholder="请选择出生日期"
                    onClick={() => { this.setState({ isShow: true }); }}
                    value={birthDay}
                    readOnly
                  />

                </div>
                <div className="option register-pwd">
                  <span className="option-title">交易密码</span>
                  <InputNum
                    maxLength={6}
                    placeholder={'请填写6位数字密码'}
                    regs={regC}
                    className={'option-input register-input register-pwd-in'}
                    onSetNum={this.setPassword}
                    defaultVal={password}
                  />
                  <input
                    type="password"
                    ref="inputPwd"
                    className="option-input register-input register-pwd-out"
                    placeholder="请填写6位数字密码"
                    value={password}
                  />
                </div>
              </div>
            </div>
            <div className="register-tips">
              注：生日不可修改，请谨慎填写。
            </div>
          </div>
          <div className="flex-none">
            <button className="btn--yellow btn-submit" onTouchTap={this.registerMember}>注册会员</button>
          </div>
        </div>
        {
          errorMSG && <Toast errorMessage={errorMSG} clearErrorMsg={this.handleClearErrorMsg} />
        }
        {
          loadInfo.status && <Loading word={loadInfo.word} />
        }

        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {this.state.isShow ?
            <InputDate
              startYear={currentY - 120}
              endYear={currentY}
              date={birthDay || '2012-08-15'}
              isAllowExceedNow={false}
              onCancelDateSelect={this.handleCancelDate}
              onCompleteDateSelect={this.handleCompleteDate}
            /> : false
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(RegisterMemberApplication);
