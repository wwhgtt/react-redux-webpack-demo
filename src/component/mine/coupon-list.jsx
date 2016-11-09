const React = require('react');
const couponHelper = require('../../helper/coupon-helper');
const commonHelper = require('../../helper/common-helper');
const noCouponLogo = require('../../asset/images/nocoupon.svg');
const shallowCompare = require('react-addons-shallow-compare');
const ItemSpand = require('../common/item-spand.jsx');
require('./coupon-list.scss');

module.exports = React.createClass({
  displayName: 'CouponList',
  propTypes:{
    couponList:React.PropTypes.array.isRequired,
  },
  getInitialState() {
    return {
      showCode:0,
      couponLogo:'',
      couponCanUseList:[],
      couponOutOfDateList:[],
      couponCanNotUseList:[],
    };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    const { couponList } = this.props;
    if (nextProps.couponList && nextProps.couponList.length !== 0 && couponList !== nextProps.couponList) {
      this.setState({
        couponLogo:noCouponLogo,
        couponCanUseList:couponHelper.filterCouponListByStatus(nextProps.couponList, 1),
        couponOutOfDateList:couponHelper.filterCouponListByStatus(nextProps.couponList, 3),
        couponCanNotUseList:couponHelper.filterCouponListByStatus(nextProps.couponList, 2),
      });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getHideRule(showCode, codeNumber) {
    if (showCode === codeNumber) {
      return false;
    }
    return true;
  },
  getRuleVale(couponType, itemInner) {
    if (
      itemInner.ruleName === 'offerValue' ||
      itemInner.ruleName === 'zkValue' ||
      itemInner.ruleName === 'giftName' ||
      itemInner.ruleName === 'faceValue') {
      return itemInner.ruleValue || '--';
    }
    return false;
  },
  getValidTime(couponStatus, startDate, endDate, checkTime) {
    let validTime = '';
    if (couponStatus !== 1) {
      if (couponStatus === 3) {
        validTime = (
          <div>
            <span className="validity-date">{couponHelper.formateDate(startDate)}</span>
            {
              startDate !== endDate && <span className="validity-date">{couponHelper.formateDate(endDate)}</span>
            }
          </div>
        );
      } else {
        validTime = <span className="validity-date">{couponHelper.formateOriginDate(checkTime)}</span>;
      }
    } else {
      validTime = (
        <div>
          <span className="validity-date">{couponHelper.formateDate(startDate)}</span>
          {
            startDate !== endDate && <span className="validity-date">{couponHelper.formateDate(endDate)}</span>
          }
        </div>
      );
    }

    return validTime;
  },
  render() {
    const { showCode,
      couponCanUseList,
      couponOutOfDateList,
      couponCanNotUseList,
      couponLogo,
    } = this.state;
    const filterCouponList = [
      { couponStatus:1, list:couponCanUseList },
      { couponStatus:2, list:couponCanNotUseList },
      { couponStatus:3, list:couponOutOfDateList },
    ];
    return (
      <div className="couponWidthData">
      {
        filterCouponList.map((itemOuter, indexOuter) => {
          if (itemOuter.list.length === 0 && couponLogo) {
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

          return (
            <div className={`coupon-outer coupon-list-${indexOuter}`} key={indexOuter}>
              {
                itemOuter.list.map((item, index) => {
                  let ruleVale = '';
                  let typeClass = '';
                  let typeUnit = '';
                  let giftTypeUnit = '';
                  let giftFontSize = '';
                  let giftVerticalAlign = '';
                  let statusWord = '';
                  let couponName = '';
                  const hideRule = this.getHideRule(showCode, item.codeNumber);
                  const validTime = this.getValidTime(item.couponStatus, item.validStartDate, item.validEndDate, item.checkTime);
                  const renderWeek = commonHelper.renderDay(item.week);
                  let instructions = [couponHelper.formateInstruction(item.instructions)];
                  if (renderWeek) {
                    instructions.push(`${renderWeek.substring(0, renderWeek.length - 1)}可用`);
                  } else {
                    instructions.push('整周可用');
                  }
                  instructions.push(item.usableCommercialDesc);

                  item.coupRuleBeanList.forEach((itemInner, indexInner) => {
                    const vale = this.getRuleVale(item.couponType, itemInner);
                    if (vale) { ruleVale = vale; }
                  });
                  switch (item.couponType) {
                    case 1: typeClass = 'manjian'; typeUnit = ' 元  满减券'; couponName = '满减劵'; break;
                    case 2: typeClass = 'zhekou'; typeUnit = ' 折  折扣券'; couponName = '折扣券'; break;
                    case 3: typeClass = 'lipin'; giftTypeUnit = '送 '; couponName = '礼品券'; giftFontSize = '1.4em'; giftVerticalAlign = '0px'; break;
                    case 4: typeClass = 'xianjin'; typeUnit = ' 元  现金券'; couponName = '现金券'; break;
                    default: break;
                  }
                  if (item.couponStatus !== 1) {
                    typeClass = 'shixiao';
                    statusWord = item.couponStatus === 3 ? '已过期' : '已使用';
                  } else {
                    statusWord = '有效期';
                  }
                  return (
                    <div className="coupon-list-outer" key={index}>
                      <ItemSpand
                        typeClass={typeClass}
                        giftUnitBefore={giftTypeUnit}
                        giftFontStyle={{ fontSize:giftFontSize, verticalAlign:giftVerticalAlign }}
                        typeUnit={typeUnit}
                        ruleVale={ruleVale}
                        fullValue={item.fullValue}
                        periodStart={item.periodStart ? item.periodStart.substring(0, 5) || '00:00' : '00:00'}
                        periodEnd={item.periodEnd ? item.periodEnd.substring(0, 5) || '00:00' : '00:00'}
                        hideRule={hideRule}
                        statusWord={statusWord}
                        validTime={validTime}
                        codeNumber={item.codeNumber}
                        instructions={instructions}
                        couponName={couponName}
                      />
                    </div>
                  );
                })
              }
            </div>
          );
        }
        )
      }
      </div>
    );
  },
});
