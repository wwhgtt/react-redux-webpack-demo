const React = require('react');
require('./password-input.scss');
// const classnames = require('classnames');

module.exports = React.createClass({
  displayName: 'PasswordInput',
  propTypes:{
    closePasswordInput: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return { password: '' };
  },
  componentWillMount() {},
  componentDidMount() {},
  render() {
    // this.setState({value: Info.name});
    // const {  } = this.props;
    const { closePasswordInput } = this.props;
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
            <input type="tel" name="password" maxLength="6" pattern="\d*" autoComplete="off" />
            <ul className="fake-input">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
            <a className="forget-password">忘记密码?</a>
          </div>
        </div>
      </div>
    );
  },
});
