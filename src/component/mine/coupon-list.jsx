const React = require('react');
const couponHelper = require('../../helper/coupon-helper');
const shallowCompare = require('react-addons-shallow-compare');

const ItemSpand = require('../common/item-spand.jsx');
const noCouponLogo = require('../../asset/images/nocoupon.svg');

require('./coupon-list.scss');

module.exports = React.createClass({
  displayName: 'CouponList',
  propTypes:{
    loyaltyCouponList:React.PropTypes.array,
    weixinCouponList:React.PropTypes.array,
  },
  getInitialState() {
    return {
      couponLogo:'',
      loyaltyCouponCanUseList:[],
      loyaltyCouponOutOfDateList:[],
      loyaltyCouponCanNotUseList:[],
      weixinCouponCanUseList:[],
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    const { loyaltyCouponList, weixinCouponList } = this.props;
    if (nextProps.loyaltyCouponList && nextProps.loyaltyCouponList.length !== 0 && loyaltyCouponList !== nextProps.loyaltyCouponList) {
      this.setState({
        couponLogo:noCouponLogo,
        loyaltyCouponCanUseList:couponHelper.filterCouponListByStatus(nextProps.loyaltyCouponList, 1),
        loyaltyCouponOutOfDateList:couponHelper.filterCouponListByStatus(nextProps.loyaltyCouponList, 3),
        loyaltyCouponCanNotUseList:couponHelper.filterCouponListByStatus(nextProps.loyaltyCouponList, 2),
      });
    }

    if (nextProps.weixinCouponList && nextProps.weixinCouponList.length !== 0 && weixinCouponList !== nextProps.weixinCouponList) {
      this.setState({
        couponLogo:noCouponLogo,
        weixinCouponCanUseList:nextProps.weixinCouponList,
      });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getValidTime(couponStatus, startDate, endDate, checkTime) {
    let validTime = '';
    validTime = (
      <div>
        <span className="validity-date">{couponHelper.formateDate(startDate)}</span>
        {
          startDate !== endDate && <span className="validity-date">{couponHelper.formateDate(endDate)}</span>
        }
      </div>
    );

    return validTime;
  },
  render() {
    const {
      loyaltyCouponCanUseList,
      loyaltyCouponOutOfDateList,
      loyaltyCouponCanNotUseList,
      weixinCouponCanUseList,
      couponLogo,
    } = this.state;
    const filterCouponList = [
      { couponStatus:1, list:{ weixin:weixinCouponCanUseList || [], loyalty:loyaltyCouponCanUseList || [] } },
      { couponStatus:2, list:{ weixin:[], loyalty:loyaltyCouponCanNotUseList || [] } },
      { couponStatus:3, list:{ weixin:[], loyalty:loyaltyCouponOutOfDateList || [] } },
    ];
    return (
      <div className="couponWidthData">
      {
        filterCouponList.map((itemOuter, indexOuter) => {
          if (itemOuter.list.weixin.length === 0 && itemOuter.list.loyalty.length === 0 && couponLogo) {
            return (
              <div
                className={`coupon-outer no-coupon-outer coupon-list-${indexOuter}`}
                key={indexOuter}
              >
                <img src={couponLogo} alt="暂无数据" className="noCouponLogo" />
                暂无优惠券
              </div>
            );
          }
          let htmlWeixin = '';
          let htmlloyalty = '';
          for (const i in itemOuter.list) {
            if (itemOuter.list[i].length === 0) {
              if (i === 'weixin') {
                htmlWeixin = '';
              } else if (i === 'loyalty') {
                htmlloyalty = '';
              }
            } else {
              if (i === 'weixin') {
                htmlWeixin = itemOuter.list[i].map((item, index) => {
                  const validTime = this.getValidTime(1, item.beginDate, item.endDate);
                  const weixinObj = couponHelper.weixinCouponParam(item);
                  return (
                    <div className="coupon-list-outer" key={index}>
                      <ItemSpand
                        typeClass={weixinObj.typeClass}
                        giftUnitBefore={weixinObj.giftTypeUnit}
                        giftFontStyle={weixinObj.giftFontStyle}
                        typeUnit={weixinObj.typeUnit}
                        ruleVale={weixinObj.ruleVale}
                        fullValue={weixinObj.fullValue}
                        periodStart={weixinObj.periodStart}
                        periodEnd={weixinObj.periodEnd}
                        statusWord={weixinObj.statusWord}
                        validTime={validTime}
                        codeNumber={weixinObj.codeNumber}
                        instructions={weixinObj.instructions}
                        couponName={weixinObj.couponName}
                      />
                    </div>
                  );
                });
              } else if (i === 'loyalty') {
                htmlloyalty = itemOuter.list[i].map((item, index) => {
                  const validTime = this.getValidTime(item.couponStatus, item.validStartDate, item.validEndDate, item.checkTime);
                  const loyaltyObj = couponHelper.loyaltyCouponParam(item);
                  return (
                    <div className="coupon-list-outer" key={index}>
                      <ItemSpand
                        typeClass={loyaltyObj.typeClass}
                        giftUnitBefore={loyaltyObj.giftUnitBefore}
                        giftFontStyle={loyaltyObj.giftFontStyle}
                        typeUnit={loyaltyObj.typeUnit}
                        ruleVale={loyaltyObj.ruleVale}
                        fullValue={loyaltyObj.fullValue}
                        periodStart={loyaltyObj.periodStart}
                        periodEnd={loyaltyObj.periodEnd}
                        statusWord={loyaltyObj.statusWord}
                        validTime={validTime}
                        codeNumber={loyaltyObj.codeNumber}
                        instructions={loyaltyObj.instructions}
                        couponName={loyaltyObj.couponName}
                      />
                    </div>
                  );
                });
              }
            }
          }
          return (
            <div className={`coupon-outer coupon-list-${indexOuter}`} key={indexOuter}>
              {htmlWeixin}
              {htmlloyalty}
            </div>
          );
        })
      }
      </div>
    );
  },
});
