const React = require('react');

const BindWxInfo = React.createClass({
  propTypes: {
    wxInfo: React.PropTypes.Object,
  },
  render() {
    return (
      <div className="bind-account mt20">
        <p>以下微信号将与手机号<span className="text-success">{this.props.wxInfo.phoneNum}</span>绑定</p>
        <div className="account-info">
          <div className="account-info-head">
            <img className="wx-head" alt="" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
          </div>
          <p className="account-info-userName"><span>{this.props.wxInfo.userName}</span></p>
        </div>
        <a className="btn account-btn btn--yellow">绑定微信号</a>
      </div>
    );
  },
});

module.exports = BindWxInfo;
