const React = require('react');
require('./password-input.scss');
const classnames = require('classnames');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
module.exports = React.createClass({
  displayName: 'PasswordInput',
  propTypes:{
    closePasswordInput: React.PropTypes.func.isRequired,
    setBalancePay: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { password: '' };
  },
  componentWillMount() {},
  componentDidMount() {},
  setPassword(e) {
    const { setBalancePay } = this.props;
    let inputNum = e.target.value;
    const regNum = /[^0-9]/g;
    // 禁止输入数字以外的字符
    if (regNum.test(inputNum)) {
      inputNum = inputNum.replace(regNum, '');
    }
    this.setState({ password: inputNum });
    if (String(inputNum).length === 6) {
      // 直接进行支付
      setBalancePay(inputNum);
      this.setState({ password: '' });
    }
  },
  handleClick() {
    this.refs.password.focus();
  },
  render() {
    // this.setState({value: Info.name});
    // const {  } = this.props;
    const { closePasswordInput } = this.props;
    const { password } = this.state;
    return (
      <div>
        <div className="password-input">
        </div>
        <div className="password-content">
          <h2 className="password-title">
            请输入密码
            <span className="close-window" onTouchTap={closePasswordInput}></span>
          </h2>
          <div className="password-detail">
            <input
              type="tel"
              maxLength="6"
              ref="password"
              onChange={evt => { if (password && password.length === 6) { return false; } return this.setPassword(evt); }}
              pattern="\d*"
              autoComplete="off"
              value={this.state.password}
            />
            <ul className="fake-input" onClick={this.handleClick}>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length >= 1 })}></i></li>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length >= 2 })}></i></li>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length >= 3 })}></i></li>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length >= 4 })}></i></li>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length >= 5 })}></i></li>
              <li><i className={classnames('password-circle', { 'password-visible': String(password).length === 6 })}></i></li>
            </ul>
            <a href={`/member/resetPwd?shopId=${getUrlParam('shopId')}&url=${encodeURIComponent(location.href)}`}className="forget-password">忘记密码?</a>
          </div>
        </div>
      </div>
    );
  },
});
