const React = require('react');
const Loading = require('../../component/mui/loading.jsx');
const PhoneVerificationCode = require('../../component/mui/form/phone-verification-code.jsx');

const classnames = require('classnames');
const connect = require('react-redux').connect;
const mineModifyPasswordAction = require('../../action/mine/mine-password.js');

require('../../asset/style/style.scss');
require('../../component/mine/mine-password.scss');
require('./application.scss');

const MineModifyPasswordApplication = React.createClass({
  displayName: 'MinePasswordApplication',
  propTypes: {
    modifyPassword: React.PropTypes.func.isRequired,
    resetPassword: React.PropTypes.func.isRequired,
    login: React.PropTypes.func.isRequired,
    fetchVericationCode: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      error: null,
      loadingInfo: null,
      password: '',
      newPassword: '',
      confirmedPassword: '',
      childView: '',
    };
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    window.addEventListener('load', this.setChildViewAccordingToHash);
  },
  setChildViewAccordingToHash() {
    this.showErrorMessage(null);
    this.setState({ childView: location.hash });
  },
  setLoadingInfo(info) {
    this.setState({ loadingInfo: info || { ing: false } });
  },
  validateResetPassword() {
    const { newPassword, confirmedPassword } = this.state;
    const passwordFields = [
      { name: 'newPassword', text: '新密码' },
      { name: 'confirmedPassword', text: '确认新密码' },
    ];
    for (let i = 0, length = passwordFields.length; i < length; i++) {
      const cur = passwordFields[i];
      const value = this.state[cur.name];
      if (!value || value.length !== 6) {
        this.showErrorMessage({ msg: `请输入${value ? '6位' : ''}${cur.text}`, names: [cur.name] });
        return false;
      }
    }

    if (confirmedPassword !== newPassword) {
      this.showErrorMessage({ msg: '两次输入密码不一致', names: ['newPassword', 'confirmedPassword'] });
      return false;
    }

    return true;
  },
  showErrorMessage(error) {
    let errorInfo = error;
    if (typeof error === 'string') {
      errorInfo = { msg: error, names: [] };
    }
    this.setState({ error: errorInfo });
  },
  resetPassword() {
    if (!this.validateResetPassword()) {
      return;
    }

    this.showErrorMessage(null);
    const { newPassword, confirmedPassword } = this.state;

    this.props.resetPassword(
      { newPassword, confirmedPassword },
      this.setLoadingInfo,
      (error) => {
        this.showErrorMessage(Object.assign(error, { names: ['newPassword'] }));
      });
  },
  handleStepOne() {
    const info = this.refs.verificationCode.getInputInfo();

    if (!info.validation.valid) {
      this.showErrorMessage({ msg: info.validation.msg, names: [] });
      return;
    }

    this.showErrorMessage(null);
    const { timeStamp } = this.state;
    const { phoneNum, code } = info.data;
    this.props.login({ timeStamp, phoneNum, code }, {
      setLoadding: this.setLoadingInfo,
      showErrorMessage: this.showErrorMessage,
      callback: (ret) => {
        location.hash = '#step2';
      },
    });
  },
  handlePasswordChange(evt) {
    const src = evt.target;
    const value = src.value;
    if (!/^\d*$/.test(value)) {
      return;
    }

    const state = {};
    state[src.name] = value;
    this.setState(state);
  },
  fetchVericationCode(phoneNum) {
    this.props.fetchVericationCode(phoneNum, {
      setLoadding: this.setLoadingInfo,
      showErrorMessage: this.showErrorMessage,
      callback: (ret) => {
        this.setState({ phoneNum, timeStamp: ret.timeStamp });
      },
    });
  },
  render() {
    const { loadingInfo, error, childView, newPassword, confirmedPassword } = this.state;
    const getOptionClass = (name) => classnames('option', { error: error && error.names.indexOf(name) !== -1 });

    return (
      <div className="flex-rest">
        {error && <div className="alert alert-error">{error.msg}</div>}
        {!childView &&
          <div>
            <PhoneVerificationCode
              onGetVerificationCode={this.fetchVericationCode}
              fetchCodeBtnText="点击获取"
              ref="verificationCode"
            />
            <div className="btn-group">
              <button className="btn--yellow btn-lg btn-radius-sm" onTouchTap={this.handleStepOne}>下一步</button>
            </div>
          </div>
        }

        {childView === '#step2' &&
          <div>
            <div className="options-group">
              <label className={getOptionClass('newPassword')}>
                <span className="option-title">新密码</span>
                <div className="option-content">
                  <input
                    type="password"
                    className="option-input"
                    name="newPassword"
                    onChange={this.handlePasswordChange}
                    maxLength="6"
                    placeholder="请输入6位数字密码"
                    value={newPassword || ''}
                  />
                </div>
              </label>
              <label className={getOptionClass('confirmedPassword')}>
                <span className="option-title">确认新密码</span>
                <div className="option-content">
                  <input
                    type="password"
                    className="option-input"
                    name="confirmedPassword"
                    onChange={this.handlePasswordChange}
                    maxLength="6"
                    placeholder="请输入6位数字密码"
                    value={confirmedPassword || ''}
                  />
                </div>
              </label>
            </div>
            <div className="btn-group">
              <button className="btn--yellow btn-lg btn-radius-sm" onTouchTap={this.resetPassword}>确定</button>
            </div>
          </div>
        }
        {loadingInfo && loadingInfo.ing && <Loading word={loadingInfo.text} />}
      </div>
    );
  },
});

module.exports = connect(state => state, mineModifyPasswordAction)(MineModifyPasswordApplication);
