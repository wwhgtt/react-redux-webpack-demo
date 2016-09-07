import React from 'react';
import InputNum from '../mui/form/input/input-number.js';
import SexSwitch from '../common/sex-switch.jsx';
import Toast from '../mui/toast.jsx';
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const InputDate = require('../mui/form/date-select.jsx');
const VerificationDialog = require('../../component/common/verification-code-dialog.jsx');

const RegisterMember = React.createClass({
  displayName:'RegisterMember',
  propTypes: {
    // MapedActionsToProps
    onRegisterMember:React.PropTypes.func.isRequired,
    onGetVerificationCode:React.PropTypes.func,
    // MapedStatesToProps
    // regs: React.PropTypes.array,
    userInfo: React.PropTypes.object,
    onSendCode: React.PropTypes.func,
    registerPhoneCode: React.PropTypes.string,
  },

  getInitialState() {
    return {
      errorMsg: '',
      errorMsgP: '',
      errorMsgC: '',
      phoneNum: '',
      password: '',
      userSex: '',
      isShow: false,
      birthDay: '',
      userName: '',
      isDisabled: false,
      brandPicUrl: '',
      phoneCode: '',
      isCodeShow: false,
      loginType: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { userInfo, registerPhoneCode } = nextProps;
    if (!this.props.registerPhoneCode) {
      this.setState({
        phoneCode: registerPhoneCode,
      });
    }

    if (this._isPropsFirstLoad) {
      return;
    }

    this._isPropsFirstLoad = true;
    this.setState({
      userSex: userInfo.sex,
      userName: userInfo.name,
      phoneNum: userInfo.mobile,
      brandPicUrl: userInfo.picUrl,
      loginType: userInfo.loginType,
    });

    if (userInfo.loginType === 0) {
      this.setState({ isDisabled: true });
    }
  },

  // 获取电话号码
  getPhoneNum(obj) {
    this.setState({ errorMsgP: obj.errorMsg, phoneNum: obj.numVal });
  },

  // 获取密码
  getPassword(obj) {
    this.setState({ errorMsgC: obj.errorMsg, password: obj.numVal });
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
    this.setState({ birthDay: obj.text });
    this.setState({ isShow: false });
  },

  // 关闭验证码发送框
  handleCodeClose() {
    this.setState({ isCodeShow: false });
  },

  // 校验验证码
  handleConfirm(inputInfo) {
    const { data, validation } = inputInfo;
    if (!validation.valid) {
      this.setState({ errorMsg: validation.msg });
      return;
    }

    this.setState({ phoneCode: data.code });
    this.setState({ isCodeShow: false });
  },
  // 注册会员
  registerMember() {
    const { errorMsgP, errorMsgC, phoneNum, password, userSex, birthDay, userName, phoneCode, loginType } = this.state;
    const regPhoneAustralia = /^04\d{8}$/;
    const isAustralia = regPhoneAustralia.test(phoneNum);
    if (!phoneNum) {
      this.setState({ errorMsg: '请填写手机号码' });
    } else if (errorMsgP) {
      this.setState({ errorMsg: errorMsgP });
    } else if (!this.refs.userName.value) {
      this.setState({ errorMsg: '请填写姓名' });
    } else if (!(userSex === '0' || userSex === '1')) {
      this.setState({ errorMsg: '请选择性别' });
    } else if (!birthDay) {
      this.setState({ errorMsg: '请选择出生日期' });
    } else if (!password) {
      this.setState({ errorMsg: '请填写交易密码' });
    } else if (errorMsgC) {
      this.setState({ errorMsg: errorMsgC });
    } else {
      if (!isAustralia && loginType !== 0 && !phoneCode) {
        this.setState({ isCodeShow: true });
        return;
      }
      const registerInfo = {
        name: userName,
        birth: birthDay,
        mobile: phoneNum,
        sex: userSex,
        pwd: password,
        code: phoneCode, // 验证码
      };
      this.props.onRegisterMember(registerInfo);
    }
  },

  handleClearErrorMsg() {
    this.setState({ errorMsg: false });
  },

  render() {
    const { password, userSex, errorMsg, userName, phoneNum, isDisabled, birthDay, brandPicUrl, isCodeShow } = this.state;
    // 中国手机号码验证规则
    const regPhone = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8}))|0[49]\d{8}$/;
    // const regEmpty = /\S/; // 非空验证规则
    const regCode = /\d{6}/; // 6位数字验证规则
    // 手机验证
    const regP = [
      { regMsg: '手机号码格式错误', reg: regPhone },
    ];
    // 6位密码验证
    const regC = [
      // { regMsg: '密码空的', reg: regEmpty },
      { regMsg: '请输入6位密码', reg: regCode },
    ];
    const currentY = new Date().getFullYear();
    // debugger;
    return (
      <div>
        <div className="register-member ">
          <div className="register-banner">
            <img className="register-banner-img" alt="" src={brandPicUrl} />
          </div>
          <div className="">
            <div className="options-group">
              <div className="option">
                <span className="option-title">手机号</span>
                <InputNum
                  maxLength={11}
                  placeholder={'请填写手机号'}
                  regs={regP}
                  className={'option-input register-input'}
                  onGetNum={this.getPhoneNum}
                  defaultVal={phoneNum}
                  disabled={isDisabled}
                />
              </div>
            </div>

            <div className="options-group">
              <div className="option register-user">
                <span className="option-title register-user-name">姓名</span>
                <SexSwitch sex={userSex} getSex={this.handleSex} />
                <input
                  type="text"
                  className="option-input register-input register-user-input"
                  placeholder="请填写姓名"
                  maxLength="30"
                  ref="userName"
                  value={userName}
                  onChange={this.handleName}
                />
              </div>
              <div className="option">
                <span className="option-title">生日</span>
                <span className="btn-arrow-right"></span>
                <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
                  {this.state.isShow ?
                    <InputDate
                      startYear={currentY - 120}
                      endYear={currentY}
                      date={birthDay || '2012-08-15'}
                      onCancelDateSelect={this.handleCancelDate}
                      onCompleteDateSelect={this.handleCompleteDate}
                    /> : false
                  }
                </ReactCSSTransitionGroup>
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
                <span className="btn-arrow-right"></span>
                <InputNum
                  maxLength={6}
                  placeholder={'请填写6位数字密码'}
                  regs={regC}
                  className={'option-input register-input register-pwd-in'}
                  onGetNum={this.getPassword}
                  defaultVal={password}
                />
                <input
                  type="password"
                  ref="inputPwd"
                  value={password}
                  className="option-input register-input register-pwd-out"
                  placeholder="请填写6位数字密码"
                />
              </div>
            </div>
          </div>
          <div className="register-tips">
            注：手机号和生日不可修改，请谨慎填写。
          </div>
          {
            errorMsg ?
              <Toast errorMessage={errorMsg} clearErrorMsg={this.handleClearErrorMsg} />
            : ''
          }
          {
            isCodeShow ?
              <VerificationDialog
                phoneNum={phoneNum}
                phoneNumDisabled
                fetchCodeBtnText={'验证码'}
                onClose={this.handleCodeClose}
                onConfirm={this.handleConfirm}
                onGetVerificationCode={this.props.onSendCode}
              />
            : ''
          }
        </div>
        <button className="btn--yellow btn-submit" onTouchTap={this.registerMember}>注册会员</button>
      </div>
    );
  },
});

module.exports = RegisterMember;
