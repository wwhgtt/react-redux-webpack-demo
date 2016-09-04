const React = require('react');

const BindWxSuccess = React.createClass({
  getInitialState() {
    return {
      wxInfo: {},
    };
  },

  componentWillMount() {
    const wxUserInfo = JSON.parse(window.sessionStorage.wxInfo);
    this.setState({ wxInfo: wxUserInfo });
  },

  render() {
    const { wxInfo } = this.state;
    return (
      <div className="bind-account mt40">
        <div className="account-info">
          <p className="account-info-current">当前绑定的微信号</p>
          <p className="account-info-head">
            <img className="wx-head" alt="" src={wxInfo.headUrl} />
          </p>
          <p className="account-info-userName">{wxInfo.name}</p>
        </div>
      </div>
    );
  },
});

module.exports = BindWxSuccess;
