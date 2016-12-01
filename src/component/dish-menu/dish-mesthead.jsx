const React = require('react');
const classnames = require('classnames');
const shallowCompare = require('react-addons-shallow-compare');
const isShopOpen = require('../../helper/dish-helper.js').isShopOpen;
const defaultShopLogo = require('../../asset/images/shop-logo-default.svg');

const AdsColumn = require('./ads-column.jsx');

require('./dish-mesthead.scss');

module.exports = React.createClass({
  displayName:'DishMesthead',
  propTypes:{
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
    const { shopInfo, shopLogo } = this.props;
    const { marketList, marketListUpdate, multiMarketing } = shopInfo || {};
    const adsExisted = (marketListUpdate && !!marketListUpdate.length) || (multiMarketing && multiMarketing.length);
    return (
      <div className={classnames('dish-mesthead', { 'ads-existed': adsExisted })}>
        <div className="shop">
          <img alt="门店logo" src={shopLogo || defaultShopLogo} className="shop-logo" />
          <a className="shop-title ellipsis">{shopInfo.commercialName || ''}</a>
          {this.getShopTimeElement(shopInfo && shopInfo.openTimeList)}
        </div>
        {adsExisted &&
          <AdsColumn
            shopInfo={shopInfo}
            marketList={marketList}
            marketListUpdate={marketListUpdate}
            multiMarketing={multiMarketing}
          />
        }
      </div>
    );
  },
});
