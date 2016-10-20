const React = require('react');
require('./ads-column.scss');
const filterBg = require('../../asset/images/filter-bg.jpg');
const helper = require('../../helper/dish-hepler');
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
  scrollPartFuc() {
    const { marketListUpdate, shopInfo } = this.props;
    const formatDishesData = shopInfo.formatDishesData;
    const scrollAll = marketListUpdate.map((item, index) => {
      let vip = '';
      if (item.rule.customerType === 1) {
        vip = '仅限会员使用';
      } else if (item.rule.customerType === 2) {
        vip = '仅限非会员使用';
      } else {
        vip = '';
      }
      const openDay = helper.renderDay(item.rule.weekdays);

      return (
        <p className={classnames('shopdiscount-item', { jian: item.rule.type === 1, zhe: item.rule.type === 2 })} key={index}>
          {formatDishesData[item.dishId].name} {item.rule.ruleName}
          （{vip} {openDay}{item.rule.periodStart}~{item.rule.periodEnd}，每单仅限{item.rule.dishNum}份）
        </p>
      );
    });
    return scrollAll;
  },
  animatePartFunc() {
    const { marketListUpdate } = this.props;
    const animateAll = marketListUpdate.map((item, index) =>
      (
      <div className="content of" key={index}>
        <i className={classnames('icon', { 'icon-jian': item.rule.type === 1, 'icon-zhe': item.rule.type === 2 })}></i>
        <span className="detail ellipsis flex-rest">{item.rule.ruleName}</span>
      </div>
      )
    );
    return animateAll;
  },
  render() {
    const { animation, allDiscount } = this.state;
    const { shopInfo } = this.props;
    const scrollPart = this.scrollPartFuc();
    const animatePart = this.animatePartFunc();
    return (
      <div className="ads-column flex-row" onTouchTap={this.showAllDiscount}>
        <div className="flex-rest of">
          <div className="content-outer" style={animation}>
            {animatePart}
          </div>
        </div>
        <img src={filterBg} className="hide" alt="" />
        <div className="flex-none">
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
    );
  },
});
module.exports = AdsColumn;
