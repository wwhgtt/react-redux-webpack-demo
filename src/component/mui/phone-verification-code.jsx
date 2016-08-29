const React = require('react');
const classnames = require('classnames');
require('./phone-verification-code.scss');

module.exports = React.createClass({
  displayName: 'PhoneVerificationCode',
  propTypes: {
    nations: React.PropTypes.array,
    onGetVerificationCode: React.PropTypes.func,
    onInputInfoChange: React.PropTypes.func,
  },
  getDefaultProps() {
    return { nations: [] };
  },
  getInitialState() {
    return {
      currentNation: 'China',
      phoneNum: '',
      code: '',
      seconds: 0,
    };
  },
  isForeignZone(currentNation) {
    return currentNation !== 'China';
  },
  isNumberStr(value) {
    return /^\d*$/.test(value);
  },
  handlePhoneNumChange(evt) {
    const value = evt.target.value.trim();
    if (!this.isNumberStr(value)) {
      return;
    }

    const info = { phoneNum: value };
    this.setState(info);
    this.handleInputInfoChange(info);
  },
  handleInputInfoChange(info) {
    const keys = ['phoneNum', 'code'];
    const _info = {};
    keys.forEach(key => {
      _info[key] = info.hasOwnProperty(key) ? info[key] : this.state[key];
    });
    _info.isForeignZone = this.isForeignZone(info.currentNation || this.state.currentNation);
    if (this.props.onInputInfoChange) {
      this.props.onInputInfoChange(_info);
    }
  },
  handleVerificationCodeChange(evt) {
    const value = evt.target.value.trim();
    if (!this.isNumberStr(value)) {
      return;
    }

    const info = { code: value };
    this.setState(info);
    this.handleInputInfoChange(info);
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
    const info = { currentNation: selectedOption.value, phoneNum: '', code: '' };
    this.clearWaiting();
    this.setState(info);
    this.handleInputInfoChange(info);
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
    const { nations } = this.props;
    let nationsSelect = null;
    if (nations && nations.length) {
      nationsSelect = (
        <select onChange={this.handleNationChange} defaultValue="China">);
          {nations.map(item => (<option key={item.value} value={item.value}>{item.text}</option>))}
        </select>
      );
    }

    const regPhoneNum = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/;
    const { seconds, phoneNum, code } = this.state;
    let btnInfo = null;
    if (seconds > 0) {
      btnInfo = { text: `${seconds}s后获取`, disabled: true };
    } else {
      btnInfo = { text: '获取验证码', disabled: !regPhoneNum.test(phoneNum) };
    }

    const className = classnames('options-group phone-verification-code', {
      foreign: this.isForeignZone(this.state.currentNation),
      'multi-nations': nations && nations.length > 0,
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
              placeholder="请输入手机号"
              onChange={this.handlePhoneNumChange}
            />
          </div>
        </div>
        <div className="option verification-code">
          <input
            className="option-content option-input"
            type="tel"
            value={code}
            placeholder="请输入验证码"
            maxLength="4"
            onChange={this.handleVerificationCodeChange}
          />
        </div>
      </div>
    );
  },
});
