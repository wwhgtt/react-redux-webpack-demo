const React = require('react');
require('./phone-verification-code.scss');

module.exports = React.createClass({
  displayName: 'PhoneVerificationCode',
  propTypes: {
    nations: React.PropTypes.array,
    shopId: React.PropTypes.string,
    onGetVerificationCode: React.PropTypes.func,
    onVerificationCodeChange: React.PropTypes.func,
  },
  getDefaultProps() {
    return {
      nations: [],
      shopId: '',
    };
  },
  getInitialState() {
    return {
      phoneNum: '',
      seconds: 0,
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    const { phoneNum, seconds } = this.state;
    return nextState.phoneNum !== phoneNum || nextState.seconds !== seconds;
  },
  handlePhoneNumChange(evt) {
    const value = evt.target.value.trim();
    const reg = /^(1(?:[358]\d{9}|7[3678]\d{8}|4[57]\d{8})|0[49]\d{10})$/;
    this.setState({ phoneNum: reg.test(value) ? value : '' });
  },
  handleVerificationCodeChange(evt) {
    const value = parseInt(evt.target.value.trim(), 10) || 0;
    if (value) {
      if (this.props.onVerificationCodeChange) {
        this.props.onVerificationCodeChange({
          code: value,
          phoneNum: this.state.phoneNum,
        });
      }
    }
  },
  handleFetchCodeBtnTouchTap(evt) {
    const btn = evt.target;
    if (btn.disabled) {
      return;
    }

    this.sendFetchVerificationCodeRequest();
    this.waitOneMinute();
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
        <select onChange={this.handleNationChange}>);
          {nations.map(item => (<option value={item.id}>{item.name}</option>))}
        </select>
      );
    }

    const { seconds, phoneNum } = this.state;
    let btnInfo = null;
    if (seconds > 0) {
      btnInfo = { text: `${seconds}s后获取`, disabled: true };
    } else {
      btnInfo = { text: '获取验证码', disabled: !phoneNum };
    }
    return (
      <div className="options-group phone-verification-code">
        <div className="option phone">
          {nationsSelect}
          <button className="btn btn--yellow" disabled={btnInfo.disabled} onTouchTap={this.handleFetchCodeBtnTouchTap}>
            {btnInfo.text}
          </button>
          <div className="option-content">
            <input className="option-input" type="tel" placeholder="请输入手机号" onChange={this.handlePhoneNumChange} />
          </div>
        </div>
        <div className="option verification-code">
          <input
            className="option-content option-input"
            type="number"
            placeholder="请输入验证码"
            maxLength="4"
            onChange={this.handleVerificationCodeChange}
          />
        </div>
      </div>
    );
  },
});
