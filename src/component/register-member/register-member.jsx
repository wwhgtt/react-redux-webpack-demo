import React from 'react';
import InputNum from '../mui/form/input/input-number.js';
import SexSwitch from '../mui/form/sex-switch.jsx';
import Toast from '../mui/toast.jsx';
const InputDate = require('../mui/form/date-select.jsx');

const RegisterMember = React.createClass({
  propTypes: {
    // MapedActionsToProps
    onRegisterMember:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    // regs: React.PropTypes.array,
    userInfo: React.PropTypes.object,
  },

  getInitialState() {
    return {
      errorMsg: '',
      errorMsgP: '', // 手机提示信息
      errorMsgC: '', // 密码提示信息
      phoneNum: '', // 手机号码
      password: '', // 注册密码
      userSex: '',
      isShow: false,
      birthDay: '2012-08-15',
      userName: '',
      isDisabled: true,
    };
  },
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const { userInfo } = nextProps;
    this.setState({
      userSex: userInfo.sex,
      userName: userInfo.name,
      phoneNum: userInfo.mobile,
    });
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

  // 注册会员
  registerMember() {
    const { errorMsgP, errorMsgC, phoneNum, password, userSex, birthDay } = this.state;
    if (!phoneNum) {
      this.setState({ errorMsg: '请填写手机号码' });
    } else if (errorMsgP) {
      this.setState({ errorMsg: errorMsgP });
    } else if (!this.refs.userName.value) {
      this.setState({ errorMsg: '请填写用户名' });
    } else if (!userSex) {
      this.setState({ errorMsg: '请选择性别' });
    } else if (!birthDay) {
      this.setState({ errorMsg: '请选择出生日期' });
    } else if (!password) {
      this.setState({ errorMsg: '请设置密码' });
    } else if (errorMsgC) {
      this.setState({ errorMsg: errorMsgC });
    } else {
      const registerInfo = {
        shopId: '123',
        birth: birthDay,
        phone: phoneNum,
        sex: userSex,
        pwd: password,
      };

      this.props.onRegisterMember(registerInfo);
    }
  },

  handleClearErrorMsg() {
    this.setState({ errorMsg: false });
  },

  render() {
    const { password, userSex, errorMsg, userName, phoneNum, isDisabled, birthDay } = this.state;
    // 中国手机号码验证规则
    const regPhone = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8}))|0[49]\d{8}$/;
    // const regEmpty = /\S/; // 非空验证规则
    const regCode = /\d{6}/; // 6位数字验证规则
    // 手机验证
    const regP = [
      // { regMsg: '电话空的', reg: regEmpty },
      { regMsg: '电话格式错误', reg: regPhone },
    ];
    // 6位密码验证
    const regC = [
      // { regMsg: '密码空的', reg: regEmpty },
      { regMsg: '6位密码', reg: regCode },
    ];
    const currentY = new Date().getFullYear();
    // debugger;
    return (
      <div className="register-member ">
        <div className="register-banner">
          <img className="register-banner-img" alt="" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
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
              <input
                type="text"
                className="option-input register-input register-user-input"
                placeholder="请填写姓名"
                maxLength="30"
                ref="userName"
                value={userName}
                onChange={this.handleName}
              />
              <SexSwitch sex={userSex} getSex={this.handleSex} />
            </div>
            <div className="option">
              <span className="option-title">生日</span>
              <span className="btn-arrow-right"></span>
              {this.state.isShow ?
                <InputDate
                  startYear={currentY - 120}
                  endYear={currentY}
                  date={this.state.birthDay}
                  onCancelDateSelect={this.handleCancelDate}
                  onCompleteDateSelect={this.handleCompleteDate}
                /> : false
              }
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
                placeholder={"请填写6位数字密码"}
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
        <button className="register-btn btn--yellow btn-submit" onTouchTap={this.registerMember}>注册会员</button>
        {
          errorMsg ?
            <Toast errorMessage={errorMsg} clearErrorMsg={this.handleClearErrorMsg} />
          : ''
        }
      </div>
    );
  },
});

module.exports = RegisterMember;
