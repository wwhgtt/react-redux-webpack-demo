const React = require('react');
require('./ads-column.scss');
const helper = require('../../helper/dish-hepler');
const commonHelper = require('../../helper/common-helper');
const classnames = require('classnames');

const AdsColumn = React.createClass({
  displayName: 'AdsColumn',
  propTypes:{
    dishesData:React.PropTypes.array,
    shopInfo:React.PropTypes.object,
    marketList:React.PropTypes.object,
    marketListUpdate:React.PropTypes.array,
  },
  getInitialState() {
    return { num:0, animation:{}, allDiscount:false };
  },
  componentWillMount() {},
  componentDidMount() {
    this._setInterval = setInterval(() => {
      let count = this.state.num;
      const { marketListUpdate } = this.props;
      if (marketListUpdate.length <= 1) {
        return;
      }
      count++;
      this.setState({ num:count }, () => {
        if (count === marketListUpdate.length) {
          this.setState({ animation:{ transition:'all 0.2s' }, num:0 });
          return;
        }
        const distanceClass = { top: '-30' * count + 'px' };
        this.setState({ animation:distanceClass });
      });
    }, 3000);
  },
  componentWillUnmount() {
    clearInterval(this._setInterval);
  },
  showAllDiscount() {
    this.setState({ allDiscount : true });
  },
  hideAllDiscount(e) {
    e.stopPropagation();
    this.setState({ allDiscount : false });
  },
  scrollPartFunc() {
    const { marketListUpdate, shopInfo } = this.props;
    const formatDishesData = shopInfo.formatDishesData;
    const scrollAll = marketListUpdate.map((item, index) => {
      if (!formatDishesData[item.dishId]) { return false; }
      let vip = '';
      if (item.rule.customerType === 1) {
        vip = '仅限会员，';
      } else if (item.rule.customerType === 2) {
        vip = '仅限非会员，';
      } else {
        vip = '';
      }
      const openDay = commonHelper.renderDay(item.rule.weekdays);
      const period = commonHelper.renderTime(item.rule.periodStart, item.rule.periodEnd);
      let condition = '';
      if (vip || openDay || period) {
        condition = `${vip + openDay + period}`;
        const length = condition.length;
        condition = `${condition.substring(0, length - 1)}可用，`;
      }
      return (
        <p className={classnames('shopdiscount-item', { jian: item.rule.type === 1, zhe: item.rule.type === 2 })} key={index}>
          <span className="spanitem">
            {formatDishesData[item.dishId].name}
            {item.rule.dishNum > 1 ? `满${item.rule.dishNum}份${item.rule.ruleName}` : item.rule.ruleName}
            （{condition}
            每单仅限{item.rule.dishNum}份）
          </span>
        </p>
      );
    });
    return scrollAll;
  },
  animatePartFunc() {
    const { marketListUpdate, shopInfo } = this.props;
    const formatDishesData = shopInfo.formatDishesData;
    const animateAll = marketListUpdate.map((item, index) => {
      if (!formatDishesData[item.dishId]) { return []; }
      return (
        <div className="content of" key={index}>
          <i className={classnames('icon', { 'icon-jian': item.rule.type === 1, 'icon-zhe': item.rule.type === 2 })}></i>
          <span className="detail ellipsis flex-rest">
            <span className="detail-inner ellipsis">
              {formatDishesData[item.dishId].name}
              {item.rule.dishNum > 1 ? `满${item.rule.dishNum}份${item.rule.ruleName}` : item.rule.ruleName}
            </span>
          </span>
        </div>
      );
    }
    );
    return animateAll;
  },
  render() {
    const { animation, allDiscount } = this.state;
    const { shopInfo } = this.props;
    const scrollPart = this.scrollPartFunc();
    const animatePart = this.animatePartFunc();
    return (
      <div>
        {
          shopInfo.marketMatchDishes &&
            <div className="ads-column flex-row" onTouchTap={this.showAllDiscount}>
              <div className="flex-rest of">
                <div className="content-outer" style={animation}>
                  {animatePart}
                </div>
              </div>
              <div className="flex-none ads-more">
                更多详情
                <i className="btn-arrow-right"></i>
              </div>
              {
                allDiscount ?
                  <div className="ads-detail">
                    <p className="shopname ellipsis">{shopInfo.commercialName || '未知的门店'}</p>
                    <div className="shopopentime">
                      <span className="title">营业时间：</span>
                      <div className="time">
                        {helper.formatOpenTime(shopInfo.openTimeList, false)}
                        <br />
                        {helper.formatOpenTime(shopInfo.openTimeList, true)}
                      </div>
                    </div>
                    <fieldset className="shopdiscount">
                      <legend className="shopdiscount-brief">优惠信息</legend>
                      <div className="scrollpart">
                        {scrollPart}
                      </div>
                      <div className="closedetail" onTouchTap={this.hideAllDiscount}></div>
                    </fieldset>
                  </div>
                :
                  false
              }
            </div>
        }
      </div>
    );
  },
});
module.exports = AdsColumn;
