import React from 'react';
import InputPhone from '../mui/input/input-number.js';

const RegisterMember = React.createClass({
  propTypes: {
    regs: React.PropTypes.Array,
  },
  getInitialState() {
    return {
      errorMsgP: '电话空的', // 手机提示信息
      errorMsgC: '密码空的', // 密码提示信息
      phoneNum: '', // 手机号码
      password: '', // 注册密码
    };
  },
  getPhoneNum(obj) {
    // console.log(obj);
    this.setState({ errorMsgP: obj.errorMsg, phoneNum: obj.numVal });
  },
  getPassword(obj) {
    this.setState({ errorMsgC: obj.errorMsg, password: obj.numVal });
  },
  registerMember() {
    console.log(this.state);
  },
  render() {
    // 中国手机号码验证规则
    const regPhone = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/;
    const regEmpty = /\S/; // 非空验证规则
    const regCode = /\d{6}/; // 6位数字验证规则
    // 手机验证
    const regP = [
      { regMsg: '电话空的', reg: regEmpty },
      { regMsg: '电话格式错误', reg: regPhone },
    ];
    // 6位密码验证
    const regC = [
      { regMsg: '密码空的', reg: regEmpty },
      { regMsg: '6位密码', reg: regCode },
    ];
    return (
      <div className="register-member ">
        <div className="register-banner">
          <img className="register-banner-img" alt="" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
        </div>
        <div className="">
          <div className="options-group">
            <div className="option">
              <span className="option-title">手机号</span>
              <InputPhone
                maxLength={11}
                placeholder={"请填写手机号"}
                regs={regP}
                className={'option-input register-input'}
                onGetNum={this.getPhoneNum}
              />
            </div>
          </div>

          <div className="options-group">
            <div className="option">
              <span className="option-title">姓名</span>
              <input type="text" className="option-input register-input" placeholder="请填写姓名" />
            </div>
            <div className="option">
              <span className="option-title">生日</span>
              <span className="btn-arrow-right"></span>
              <input type="text" className="option-input register-input" placeholder="请选择出生日期" />

            </div>
            <div className="option">
              <span className="option-title">交易密码</span>
              <span className="btn-arrow-right"></span>
              <InputPhone
                maxLength={6}
                placeholder={"请填写6位数字密码"}
                regs={regC}
                className={'option-input register-input'}
                onGetNum={this.getPassword}
              />
              <input type="password" ref="inputPwd" value={this.state.password} className="option-input register-input" placeholder="请填写6位数字密码" />
            </div>
          </div>
        </div>
        <button className="register-btn btn--yellow btn-bottom" onClick={this.registerMember}>注册会员</button>
      </div>
    );
  },
});

module.exports = RegisterMember;
