const React = require('react');
const classnames = require('classnames');
require('./phone-verification-code.scss');

const nationsInfo = [
  {
    text: '中国', value: 'China', phoneReg: /^1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})$/, isAllowSendCode: true,
    children: [
      { text: '台湾', value: 'TaiWan', phoneReg: /^09\d{8}$/, isAllowSendCode: false },
    ],
  },
  { text: '澳大利亚', value: 'Australia', phoneReg: /^04\d{8}$/, isAllowSendCode: false, defaultCode: '1111' },
];
const getNationInfo = id => nationsInfo.filter(item => item.value === id).shift();

module.exports = React.createClass({
  displayName: 'PhoneVerificationCode',
  propTypes: {
    placeholder: React.PropTypes.object,
    phoneNum: React.PropTypes.string,
    phoneNumDisabled: React.PropTypes.bool,
    fetchCodeBtnText: React.PropTypes.string,
    completeFlag: React.PropTypes.number,
    hasForeignZone: React.PropTypes.bool,
    onGetVerificationCode: React.PropTypes.func,
    onCompleteInput: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      hasForeignZone: false,
      phoneNum: '',
      phoneNumDisabled: false,
      fetchCodeBtnText: '获取验证码',
      placeholder: {
        phoneNum: '请输入手机号',
        code: '请输入验证码',
      },
    };
  },
  getInitialState() {
    const { phoneNum } = this.props;
    return {
      currentNation: 'China',
      phoneNum: phoneNum || '',
      code: '',
      seconds: 0,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.completeFlag !== this.props.completeFlag) {
      this.handleCompleteInput();
    }
  },
  componentWillUnmount() {
    this.clearWaiting();
  },
  getDefaultVerificationCode(currentNation) {
    const nation = getNationInfo(currentNation);
    return nation && nation.defaultCode || '';
  },
  getInputInfo() {
    const keys = ['phoneNum', 'code'];
    const info = {};
    keys.forEach(key => {
      info[key] = this.state[key];
    });

    const currentNation = info.currentNation || this.state.currentNation;
    info.isForeignZone = this.isForeignZone(currentNation);
    info.code = info.code || this.getDefaultVerificationCode(currentNation);
    return { data: info, validation: this.validateInput(info) };
  },
  isForeignZone(currentNation) {
    return currentNation !== 'China';
  },
  isNumberStr(value) {
    return /^\d*$/.test(value);
  },
  isValidPhoneNum(phoneNum, currentNation) {
    let result = false;
    const nation = getNationInfo(currentNation);
    if (!nation) {
      return result;
    }

    const valiatePhone = items => {
      items.forEach(item => {
        if (item.children && item.children.length) {
          valiatePhone(item.children);
        }
        result = result || item.phoneReg.test(phoneNum);
      });
    };
    valiatePhone([nation]);
    return result;
  },
  isAllowSendCode(phoneNum, currentNation) {
    const nation = getNationInfo(currentNation);
    return nation && nation.isAllowSendCode && nation.phoneReg.test(phoneNum);
  },
  validateInput(info) {
    const { phoneNum, code, isForeignZone } = info;
    const { placeholder } = this.props;
    const { currentNation } = this.state;
    if (!phoneNum) {
      return { valid: false, code: 'PHONENUM_EMPTY', msg: placeholder.phoneNum };
    }

    if (!this.isValidPhoneNum(phoneNum, currentNation)) {
      return { valid: false, code: 'PHONENUM_INVALID', msg: '请输入正确的手机号' };
    }

    if (!isForeignZone) {
      if (!code) {
        return { valid: false, code: 'CODE_EMPTY', msg: placeholder.code };
      }
      if (!/^\d{4}$/.test(code)) {
        return { valid: false, code: 'CODE_INVALID', msg: '请输入正确的验证码' };
      }
    }
    return { valid: true, code: '', msg: '' };
  },
  handlePhoneNumChange(evt) {
    const value = evt.target.value.trim();
    if (!this.isNumberStr(value)) {
      return;
    }

    this.setState({ phoneNum: value });
  },
  handleCompleteInput() {
    const info = this.getInputInfo();
    if (this.props.onCompleteInput) {
      this.props.onCompleteInput(info);
    }
  },
  handleVerificationCodeChange(evt) {
    const value = evt.target.value.trim();
    if (!this.isNumberStr(value)) {
      return;
    }

    this.setState({ code: value });
  },
  handleFetchCodeBtnTouchTap(evt) {
    const btn = evt.target;
    if (btn.disabled) {
      return;
    }

    this.sendFetchVerificationCodeRequest();
    this.waitOneMinute();
  },
  handleNationChange(evt) {
    const select = evt.target;
    const selectedOption = select.options[select.selectedIndex];
    this.clearWaiting();
    this.setState({ currentNation: selectedOption.value, phoneNum: '', code: '' });
  },
  clearWaiting() {
    if (this._timer) {
      window.clearTimeout(this._timer);
      this.setState({ seconds: 0 });
      this._timer = null;
    }
  },
  sendFetchVerificationCodeRequest() {
    const { phoneNum } = this.state;
    if (this.props.onGetVerificationCode) {
      this.props.onGetVerificationCode(phoneNum);
    }
  },
  waitOneMinute() {
    const next = seconds => {
      if (seconds === 0) {
        this.setState({ seconds: 0 });
        return;
      }

      this.setState({ seconds });
      this._timer = window.setTimeout(() => { next(seconds - 1); }, 1000);
    };
    next(60);
  },
  render() {
    const { hasForeignZone, placeholder, phoneNumDisabled, fetchCodeBtnText } = this.props;
    let nationsSelect = null;
    if (hasForeignZone) {
      nationsSelect = (
        <select onChange={this.handleNationChange} defaultValue="China">);
          {nationsInfo.map(item => (<option key={item.value} value={item.value}>{item.text}</option>))}
        </select>
      );
    }

    const { seconds, phoneNum, code, currentNation } = this.state;
    let btnInfo = null;
    if (seconds > 0) {
      btnInfo = { text: `${seconds}s后获取`, disabled: true };
    } else {
      btnInfo = { text: fetchCodeBtnText, disabled: !this.isAllowSendCode(phoneNum, currentNation) };
    }

    const className = classnames('phone-verification-code', {
      foreign: this.isForeignZone(currentNation),
      'multi-nations': hasForeignZone,
    });
    return (
      <div className={className}>
        <button className="btn btn--yellow" disabled={btnInfo.disabled} onTouchTap={this.handleFetchCodeBtnTouchTap}>
          {btnInfo.text}
        </button>
        <div className="form-group phone">
          {nationsSelect}
          <input
            type="tel"
            disabled={phoneNumDisabled}
            value={phoneNum}
            placeholder={placeholder.phoneNum}
            maxLength={11}
            onChange={this.handlePhoneNumChange}
          />
        </div>
        <div className="form-group verification-code">
          <input
            type="tel"
            value={code}
            placeholder={placeholder.code}
            maxLength="4"
            onChange={this.handleVerificationCodeChange}
          />
        </div>
      </div>
    );
  },
});
