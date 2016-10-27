const React = require('react');

const ActivateSuccessApplication = React.createClass({
  displayName: 'ActivateSuccessApplication',
  propTypes: {

  },

  render() {
    return (
      <div className="activate-success flex-rest">
        <div className="activate-img activate-img-success"></div>

        <div className="activate-info">
          <p className="activate-info-title">恭喜</p>
          <p className="activate-info-item">您的微信会员卡已被成功激活</p>
          <p className="activate-info-item">快去卡包中看看吧！</p>
        </div>
      </div>
    );
  },
});

module.exports = ActivateSuccessApplication;
