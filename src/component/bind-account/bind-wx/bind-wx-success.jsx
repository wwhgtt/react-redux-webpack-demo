const React = require('react');
const config = require('../../../config');

const BindWxSuccess = React.createClass({
  displayName:'BindWxSuccess',
  getInitialState() {
    return {
      wxInfo: {},
    };
  },

  componentWillMount() {
    const wxUserInfo = JSON.parse(window.sessionStorage.getItem('wxInfo'));
    const shopId = wxUserInfo.shopIdWX;
    this.setState({ wxInfo: wxUserInfo });
    setTimeout(() => {
      location.href = `${config.mineIndexURL}?shopId=${shopId}`;
    }, 3000);
  },

  render() {
    const { wxInfo } = this.state;
    return (
      <div className="bind-account mt-40">
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
