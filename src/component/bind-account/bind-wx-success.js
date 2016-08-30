const React = require('react');

const BindWxSuccess = React.createClass({
  render() {
    return (
      <div className="bind-account mt40">
        <div className="account-info">
          <p className="account-info-current">当前绑定的微信号</p>
          <p className="account-info-head">
            <img className="wx-head" alt="" src="http://7i7ie3.com2.z0.glb.qiniucdn.com/o_1an1m1l19j5hapvdl468i18jf9.jpg" />
          </p>
          <p className="account-info-userName">黎逝33</p>
        </div>
      </div>
    );
  },
});

module.exports = BindWxSuccess;
