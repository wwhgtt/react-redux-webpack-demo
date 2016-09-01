const React = require('react');
const classnames = require('classnames');
require('./phone-verification-code.scss');
module.exports = React.createClass({
  displayName: 'PhoneVerificationCode',
  propTypes: {
    placeholder: React.PropTypes.object,
    completeFlag: React.PropTypes.number,
    hasForeignZone: React.PropTypes.bool,
    onGetVerificationCode: React.PropTypes.func,
    onCompleteInput: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      hasForeignZone: false,
      placeholder: {
        phoneNum: '请输入手机号',
        code: '请输入验证码',
      },
    };
  },
  getInitialState() {
    return {
      currentNation: 'China',
      phoneNum: '',
      code: '',
      seconds: 0,
    };
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.completeFlag !== this.props.completeFlag) {
      this.handleCompleteInput();
    }
  },
  getInputInfo() {
    const keys = ['phoneNum', 'code'];
    const info = {};
    keys.forEach(key => {
      info[key] = this.state[key];
    });
    info.isForeignZone = this.isForeignZone(info.currentNation || this.state.currentNation);
    const validation = this.validateInput(info);
    return { data: info, validation };
  },
  isForeignZone(currentNation) {
    return currentNation !== 'China';
  },
  isNumberStr(value) {
    return /^\d*$/.test(value);
  },
  isValidPhoneNum(phoneNum) {
    return /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{8})$/.test(phoneNum);
  },
  validateInput(info) {
    const { phoneNum, code, isForeignZone } = info;
    const { placeholder } = this.props;
    if (!phoneNum) {
      return { valid: false, code: 'PHONENUM_EMPTY', msg: placeholder.phoneNum };
    }

    if (!this.isValidPhoneNum(phoneNum)) {
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
  _getNations() {
    return [
      { text: '中国', value: 'China' },
      { text: '澳大利亚', value: 'Australia' },
    ];
  },
  render() {
    const { hasForeignZone, placeholder } = this.props;
    let nationsSelect = null;
    if (hasForeignZone) {
      const nations = this._getNations();
      nationsSelect = (
        <select onChange={this.handleNationChange} defaultValue="China">);
          {nations.map(item => (<option key={item.value} value={item.value}>{item.text}</option>))}
        </select>
      );
    }

    const { seconds, phoneNum, code } = this.state;
    let btnInfo = null;
    if (seconds > 0) {
      btnInfo = { text: `${seconds}s后获取`, disabled: true };
    } else {
      btnInfo = { text: '获取验证码', disabled: !this.isValidPhoneNum(phoneNum) };
    }

    const className = classnames('options-group phone-verification-code', {
      foreign: this.isForeignZone(this.state.currentNation),
      'multi-nations': hasForeignZone,
    });
    return (
      <div className={className}>
        <div className="option phone">
          {nationsSelect}
          <button className="btn btn--yellow" disabled={btnInfo.disabled} onTouchTap={this.handleFetchCodeBtnTouchTap}>
            {btnInfo.text}
          </button>
          <div className="option-content">
            <input
              className="option-input"
              type="tel"
              value={phoneNum}
              placeholder={placeholder.phoneNum}
              onChange={this.handlePhoneNumChange}
            />
          </div>
        </div>
        <div className="option verification-code">
          <input
            className="option-content option-input"
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
