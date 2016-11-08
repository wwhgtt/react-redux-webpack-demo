const React = require('react');
const classnames = require('classnames');
const shallowCompare = require('react-addons-shallow-compare');
const isShopOpen = require('../../helper/dish-hepler.js').isShopOpen;
const defaultShopLogo = require('../../asset/images/default.png');

const AdsColumn = require('./ads-column.jsx');

require('./dish-mesthead.scss');

module.exports = React.createClass({
  displayName:'DishMesthead',
  propTypes:{
    registered: React.PropTypes.bool,
    ads: React.PropTypes.array,
    shopInfo: React.PropTypes.object,
    shopLogo: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      shopInfo: {},
      registered: false,
    };
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getShopTimeElement(timeList) {
    const isOpen = isShopOpen(timeList);
    const text = isOpen ? '营业中' : '已打烊';

    return (
      <time className={classnames('shop-time', { 'shop-time-close': !isOpen })}>{text}</time>
    );
  },
  render() {
    const { registered, shopInfo, shopLogo } = this.props;
    const { marketList, marketListUpdate } = shopInfo || {};
    return (
      <div className={classnames('dish-mesthead', { 'register-no': !registered })}>
        {!registered &&
          <div className="register notice">
            <a href={`/member/register${location.search}`}>去注册</a>
            <p>注册会员享受更多福利哟～</p>
          </div>
        }
        <div className="shop">
          <img alt="门店logo" src={shopLogo || defaultShopLogo} className="shop-logo" />
          <a className="shop-title ellipsis">{shopInfo.commercialName || ''}</a>
          {this.getShopTimeElement(shopInfo && shopInfo.openTimeList)}
        </div>
        {marketListUpdate && !!marketListUpdate.length &&
          <AdsColumn
            shopInfo={shopInfo}
            marketList={marketList}
            marketListUpdate={marketListUpdate}
          />
        }
      </div>
    );
  },
});
