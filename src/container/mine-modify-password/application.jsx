const React = require('react');
const Loading = require('../../component/mui/loading.jsx');

const classnames = require('classnames');
const connect = require('react-redux').connect;
const mineModifyPasswordAction = require('../../action/mine/mine-password.js');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const shopId = getUrlParam('shopId');

require('../../asset/style/style.scss');
require('../../component/mine/mine-password.scss');
require('./application.scss');

const MineModifyPasswordApplication = React.createClass({
  displayName: 'MineModifyPasswordApplication',
  propTypes: {
    modifyPassword: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      error: null,
      loadingInfo: null,
      password: '',
      newPassword: '',
      confirmedPassword: '',
    };
  },
  setLoadingInfo(info) {
    this.setState({ loadingInfo: info || { ing: false } });
  },
  validate() {
    const { newPassword, confirmedPassword } = this.state;
    const passwordFields = [
      { name: 'password', text: '当前密码' },
      { name: 'newPassword', text: '重置密码' },
      { name: 'confirmedPassword', text: '确认密码' },
    ];

    for (let i = 0, length = passwordFields.length; i < length; i++) {
      const cur = passwordFields[i];
      const value = this.state[cur.name];
      if (!value || value.length !== 6) {
        this.showErrorMessage({ msg: `请输入${value ? '6位数' : ''}${cur.text}`, names: [cur.name] });
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
    this.setState({ error });
  },
  submit() {
    if (!this.validate()) {
      return;
    }

    this.showErrorMessage(null);
    const { password, newPassword, confirmedPassword } = this.state;

    this.props.modifyPassword(
      { password, newPassword, confirmedPassword },
      this.setLoadingInfo,
      (error) => {
        this.showErrorMessage(Object.assign({ names: ['password'] }, error));
      },
      { password, newPassword, confirmedPassword });
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
  render() {
    const { password, newPassword, confirmedPassword, loadingInfo, error } = this.state;
    const getOptionClass = (name) => classnames('option', { error: error && error.names.indexOf(name) !== -1 });
    const resetPwdUrl = `/member/resetPwd?shopId=${shopId}`;

    return (
      <div className="flex-columns">
        {error && <div className="alert alert-error">{error.msg}</div>}
        <div className="flex-rest">
          <div className="options-group">
            <label className={getOptionClass('password')}>
              <span className="option-title">当前密码</span>
              <div className="option-content">
                <input
                  type="password"
                  className="option-input"
                  name="password"
                  onChange={this.handlePasswordChange}
                  maxLength="6"
                  placeholder="请输入6位数字密码"
                  value={password || ''}
                />
              </div>
            </label>
          </div>
          <div className="options-group">
            <label className={getOptionClass('newPassword')}>
              <span className="option-title">重置密码</span>
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
              <span className="option-title">确认密码</span>
              <div className="option-content">
                <input
                  type="password"
                  className="option-input"
                  name="confirmedPassword"
                  onChange={this.handlePasswordChange}
                  maxLength="6"
                  placeholder="请再次输入密码"
                  value={confirmedPassword || ''}
                />
              </div>
            </label>
          </div>
          <div className="btn-group">
            <button className="btn--yellow btn-lg btn-radius-sm" onTouchTap={this.submit}>确定</button>
          </div>
          <a href={resetPwdUrl} className="forget-password">忘记密码？</a>
        </div>
        <div className="copyright flex-none"></div>
        {loadingInfo && loadingInfo.ing && <Loading word={loadingInfo.text} />}
      </div>
    );
  },
});

module.exports = connect(state => state, mineModifyPasswordAction)(MineModifyPasswordApplication);
