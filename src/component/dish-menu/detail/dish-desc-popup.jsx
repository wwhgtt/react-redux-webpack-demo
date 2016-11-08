const React = require('react');
const imagePlaceholder = require('../../../asset/images/dish-placeholder-large.png');
const helper = require('../../../helper/dish-hepler');
const shopId = helper.getUrlParam('shopId');
require('./dish-detail-container.scss');
require('./dish-desc-popup.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  render() {
    const { dish } = this.props;

    let memberPrice;
    if (dish.isMember && dish.discountType === 1) {
      // dish.memberPrice = discount, e.g. 5 means 50% discount
      memberPrice = dish.marketPrice * dish.memberPrice * 0.1;
    } else if (dish.isMember && dish.discountType === 2) {
      memberPrice = dish.memberPrice;
    }
    let registerUrl = `http://${location.host}/member/register?shopId=${shopId}&returnUrl=${encodeURIComponent(location.href)}`;
    if (dish.loginType && +dish.loginType === 1) {
      // 微信登录
      registerUrl = `http://${location.host}/user/validBindMobile?shopId=${shopId}&returnUrl=${encodeURIComponent(location.href)}`;
    }

    return (
      <div className="dish-detail-container">
        <div className="dish-detail-close" onTouchTap={this.onCloseBtnTap}>
          <a className="btn-close"></a>
        </div>
        <div className="dish-detail-content dish-detail-content--white flex-columns">
          <div className="dish-desc-content flex-rest">
            <div className="dish-desc-image" style={{ backgroundImage: `url(${dish.largeImgUrl || imagePlaceholder})` }}></div>
            <div className="dish-desc-info">
              <h2 className="dish-desc-title">{helper.generateDishNameWithUnit(dish)}</h2>
              {dish.isMember ?
                <p className="clearfix">
                  <span className="dish-desc-price--bold price">{memberPrice.toFixed(2)}</span>
                  <span className="price-badge-wrap">
                    <span className="dish-desc-price-badge">{dish.discountLevel}专享{dish.discountType === 1 ? `${dish.memberPrice}折优惠` : '价'}</span>
                    <br />
                    <span className="dish-desc-price--del price">{dish.marketPrice}</span>
                  </span>
                </p>
                : <p className="clearfix"><span className="dish-desc-price--bold price">{dish.marketPrice}</span></p>
              }
              <h3 className="dish-desc-subtitle">美食简介</h3>
              <p className="dish-desc-desc">{dish.dishDesc}</p>
            </div>
          </div>
          {!dish.isUserMember ?
            <div className="dish-desc-register flex-none">
              <span className="dish-desc-register-text">注册会员，享受惊喜价格哦！</span>
              <button
                className="dish-desc-register-btn"
                onTouchTap={
                  (evt) => {
                    evt.preventDefault();
                    location.href = registerUrl;
                  }
                }
              >注册会员</button>
            </div>
            :
            false
          }
        </div>
      </div>
    );
  },
});
