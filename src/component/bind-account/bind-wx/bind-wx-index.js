const React = require('react');

const BindWxIndex = React.createClass({
  propTypes:{
    onGetOpenId: React.PropTypes.func,
  },

  handleGetOpenId() {
    this.props.onGetOpenId();
  },

  render() {
    return (
      <div className="bind-account mt40">
        <div className="wx-img-grey"></div>
        <div className="account-info">
          <p className="account-info-state">您还没有绑定微信号</p>
          <p className="account-info-tips">绑定微信号可以在您下次登录时使用微信号登录</p>
        </div>
        <a className="btn account-btn btn--yellow" onTouchTap={this.handleGetOpenId}>绑定微信号</a>
      </div>
    );
  },
});

module.exports = BindWxIndex;
