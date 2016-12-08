const React = require('react');
require('./ads-column.scss');
const helper = require('../../helper/dish-helper');
const commonHelper = require('../../helper/common-helper');
const classnames = require('classnames');

const AdsColumn = React.createClass({
  displayName: 'AdsColumn',
  propTypes:{
    dishesData:React.PropTypes.array,
    shopInfo:React.PropTypes.object,
    marketList:React.PropTypes.object,
    marketListUpdate:React.PropTypes.array,
    multiMarketing: React.PropTypes.array,
    notice: React.PropTypes.string,
  },
  getInitialState() {
    return { animation:{}, allDiscount:false, totalShowScroll:[] };
  },
  componentWillMount() {
    const { marketListUpdate, multiMarketing, notice } = this.props;
    const totalShowScroll = (marketListUpdate || []).concat(multiMarketing || []).concat(notice ? [{ type:-1, notice }] : []);
    this.setState({ totalShowScroll });
  },
  componentDidMount() {
    this._setInterval = setInterval(() => {
      const { totalShowScroll } = this.state;
      if (totalShowScroll.length === 1) {
        return;
      }
      const distanceClass = { top: '-30px', transition:'all .5s' };
      this.setState({ animation:distanceClass }, () => {
        setTimeout(() => {
          this.setState({ animation:{ top:0, transition:'none' }, totalShowScroll:this.changeMarketList(totalShowScroll) });
          // this.setState({ marketListUpdate:[] });
        }, 500);
      });
    }, 3000);
  },
  componentWillUnmount() {
    clearInterval(this._setInterval);
  },
  changeMarketList(list = []) {
    const listOne = list[0];
    const copyList = Array.prototype.slice.call(list);
    copyList.splice(0, 1);
    copyList.push(listOne);
    return copyList;
  },
  showAllDiscount() {
    this.setState({ allDiscount : true });
  },
  hideAllDiscount(e) {
    e.stopPropagation();
    this.setState({ allDiscount : false });
  },
  construntRuleName(item) {
    if (!item.dishId) { return `满${item.consumeLimit}元${item.ruleName}`; }
    if (item.rule.dishNum > 1) {
      return `满${item.rule.dishNum}份${item.rule.ruleName}`;
    }
    return item.rule.ruleName;
  },
  construntDishNum(item) {
    if (!item.dishId) { return ''; }
    return `，每单限${item.rule.dishNum}份`;
  },
  scrollPartFunc() {
    const { marketListUpdate, shopInfo, multiMarketing } = this.props;
    const formatDishesData = shopInfo.formatDishesData;
    const infoList = marketListUpdate ? marketListUpdate.concat(multiMarketing || []) : (multiMarketing || []);
    const scrollAll = infoList.map((item, index) => {
      if (item.dishId && !formatDishesData[item.dishId]) { return false; }
      let vip = '';
      if ((item.customerType && item.customerType === 1) || (item.rule && item.rule.customerType === 1)) {
        vip = '仅限会员，';
      } else if ((item.customerType && item.customerType === 2) || (item.rule && item.rule.customerType === 1)) {
        vip = '仅限非会员，';
      } else {
        vip = '';
      }
      const openDay = commonHelper.renderDay(item.weekdays || item.rule.weekdays);
      const period = item.dishId ?
        commonHelper.renderTime(item.rule.periodStart, item.rule.periodEnd)
        :
        commonHelper.renderTime(item.periodStart, item.periodEnd);
      let condition = '';
      if (vip || openDay || period) {
        condition = `${vip + openDay + period}`;
        const length = condition.length;
        condition = `${condition.substring(0, length - 1)}可用`;
      }

      return (
        <p
          className={
            classnames('shopdiscount-item',
            { jian: (item.type && item.type === 1) || (item.rule && item.rule.type === 1),
              zhe: (item.type && item.type === 2) || (item.rule && item.rule.type === 2),
            })}
          key={index}
        >
          <span className="spanitem">
          {item.dishId ? formatDishesData[item.dishId].name : '全部商品'}
          {item.dishId ?
            formatDishesData[item.dishId].spec && `(${formatDishesData[item.dishId].spec})`
            :
            false
          }
          {this.construntRuleName(item)}
          {condition || this.construntDishNum(item) ?
            `（${condition}
              ${this.construntDishNum(item)}）`
            :
            false
          }

          </span>
        </p>
      );
    });
    return scrollAll;
  },
  animatePartFunc() {
    const { shopInfo } = this.props;
    const { totalShowScroll } = this.state;
    const formatDishesData = shopInfo.formatDishesData;
    const infoList = totalShowScroll || [];

    const animateAll = infoList.map((item, index) => {
      if (item.dishId && !formatDishesData[item.dishId]) { return []; }
      if (item.type === -1) {
        return (
          <div className="content of" key={index}>
            <i className="icon icon-notice"></i>
            <span className="detail ellipsis flex-rest">
              <span className="detail-inner ellipsis" style={{ width: '100%' }}>
                商家公告：{item.notice}
              </span>
            </span>
          </div>
        );
      }
      return (
        <div className="content of" key={index}>
          <i
            className={
              classnames('icon', {
                'icon-jian': (item.type && item.type === 1) || (item.rule && item.rule.type === 1),
                'icon-zhe':(item.type && item.type === 2) || (item.rule && item.rule.type === 2),
              })
            }
          ></i>
          <span className="detail ellipsis flex-rest">
            <span className="detail-inner ellipsis">
              {item.dishId ? formatDishesData[item.dishId].name : '全部商品'}
              {item.dishId ?
                formatDishesData[item.dishId].spec && `(${formatDishesData[item.dishId].spec})`
                :
                false
              }
              {this.construntRuleName(item)}
            </span>
          </span>
        </div>
      );
    });
    return animateAll;
  },
  render() {
    const { animation, allDiscount } = this.state;
    const { shopInfo, multiMarketing, notice } = this.props;
    const scrollPart = this.scrollPartFunc();
    const animatePart = this.animatePartFunc();
    return (
      <div>
        {
          (shopInfo.marketMatchDishes || (multiMarketing && multiMarketing.length) || shopInfo.notice) &&
            <div className="ads-column flex-row" onTouchTap={this.showAllDiscount}>
              <div className="flex-rest of">
                <div className="content-outer" style={animation}>
                  {animatePart}
                </div>
              </div>
              <div className="flex-none ads-more">
                更多优惠
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
                    <div className="fieldset-outer">
                      {
                        scrollPart && scrollPart.length !== 0 &&
                          <fieldset className="shopdiscount">
                            <legend className="shopdiscount-brief">优惠信息</legend>
                            <div className="scrollpart">
                              {scrollPart}
                            </div>
                          </fieldset>
                      }
                      {
                        notice &&
                          <fieldset className="shopdiscount">
                            <legend className="shopdiscount-brief">商家公告</legend>
                            <div className="scrollpart noticepart">
                              {notice}
                            </div>
                          </fieldset>
                      }
                    </div>
                    <div className="closedetail" onTouchTap={this.hideAllDiscount}></div>
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
