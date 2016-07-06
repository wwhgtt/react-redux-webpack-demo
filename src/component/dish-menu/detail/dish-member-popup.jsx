const React = require('react');

require('./dish-detail-container.scss');
require('./dish-member-popup.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  render() {
    /* const { dish, onAddToCarBtnTap } = this.props;*/
    return (
      <div className="dish-detail-container">
        <a href="" className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content">
          <img className="memberdish-image" src="" alt="" />
          <div className="memberdish-content">
            <h2 className="memberdish-title">呼啦豆腐</h2>
            <p className="clearfix">
              <span className="memberdish-price--small price">22</span>
              <span className="memberdish-price--large price">28</span>
            </p>
            <p className="clearfix">
              <span className="memberdish-price--large price">28</span>
              <a href="" className="btn--ellips memberdish-login">会员登录</a>
              <span className="memberdish-login-desc">享受惊喜价格</span>
            </p>
            <h3 className="memberdish-subtitle">美食简介</h3>
            <p className="memberdish-desc">无敌好吃的胡萝卜烧鸭饭，走过看过不要错过 新用户免费试吃，老板有钱，任性。</p>
          </div>
        </div>
      </div>
    );
  },
});
