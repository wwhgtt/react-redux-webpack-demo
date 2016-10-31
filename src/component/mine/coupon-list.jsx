const React = require('react');
const couponHelper = require('../../helper/coupon-helper');
const commonHelper = require('../../helper/common-helper');
const noCouponLogo = require('../../asset/images/nocoupon.svg');
const shallowCompare = require('react-addons-shallow-compare');
const classnames = require('classnames');
require('./coupon-list.scss');

module.exports = React.createClass({
  displayName: 'CouponList',
  propTypes:{
    couponList:React.PropTypes.array.isRequired,
    couponStatus:React.PropTypes.number.isRequired,
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
        validTime = <span className="validity-date">{couponHelper.formateDate(endDate)}</span>;
      } else {
        validTime = <span className="validity-date">{couponHelper.formateOriginDate(checkTime)}</span>;
      }
    } else {
      validTime = (
        <div>
          <span className="validity-date">{couponHelper.formateDate(startDate)}</span>
          <span className="validity-date">{couponHelper.formateDate(endDate)}</span>
        </div>
      );
    }

    return validTime;
  },
  showDetail(code) {
    if (this.state.showCode === code) {
      this.setState({ showCode:0 });
    } else {
      this.setState({ showCode:code });
    }
  },
  render() {
    const { couponStatus } = this.props;
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
          if (itemOuter.list.length === 0) {
            return (
              <div className={classnames('no-coupon-outer', { show: itemOuter.couponStatus === couponStatus && couponLogo })} key={indexOuter}>
                <img src={couponLogo} alt="暂无数据" className="noCouponLogo" />
                暂无优惠券
              </div>
            );
          }
          return (
            <div className={classnames('coupon-outer', { show: itemOuter.couponStatus === couponStatus })} key={indexOuter}>
              {
                itemOuter.list.map((item, index) => {
                  let ruleVale = '';
                  let typeClass = '';
                  let typeUnit = '';
                  let giftTypeUnit = '';
                  let giftFontSize = '';
                  let statusWord = '';
                  const hideRule = this.getHideRule(showCode, item.codeNumber);
                  const validTime = this.getValidTime(item.couponStatus, item.validStartDate, item.validEndDate, item.checkTime);
                  const renderWeek = commonHelper.renderDay(item.week);

                  item.coupRuleBeanList.forEach((itemInner, indexInner) => {
                    const vale = this.getRuleVale(item.couponType, itemInner);
                    if (vale) { ruleVale = vale; }
                  });
                  switch (item.couponType) {
                    case 1: typeClass = 'manjian'; typeUnit = '元 满减券'; break;
                    case 2: typeClass = 'zhekou'; typeUnit = '折 折扣券'; break;
                    case 3: typeClass = 'lipin'; giftTypeUnit = '送'; giftFontSize = '1.4em'; break;
                    case 4: typeClass = 'xianjin'; typeUnit = '元 现金券'; break;
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
                      <div className="uprow of" onTouchTap={() => this.showDetail(item.codeNumber)}>
                        <div className={typeClass ? `uprow-leftpart ${typeClass}` : 'uprow-leftpart'}>
                          <div className="uprow-leftpart-value">
                            {giftTypeUnit}<span className="discount-num" style={{ fontSize:giftFontSize }}>{ruleVale}</span>{typeUnit}
                            <br />
                            <span className="expense-condition">消费满{item.fullValue || '任意'}元可用
                            ({item.periodStart ? item.periodStart.substring(0, 5) || '00:00' : '00:00'}
                             ~
                             {item.periodEnd ? item.periodEnd.substring(0, 5) || '00:00' : '00:00'})
                            </span>
                            <p className="detail-click">
                              代金券使用规则<span className={classnames({ arrowup:!hideRule, arrowdown:hideRule })}></span>
                            </p>
                          </div>
                        </div>
                        <div className="uprow-rightpart">
                          <p className="validity">{statusWord}</p>
                          {validTime}
                        </div>
                      </div>
                      <div className={classnames('downrow of', { show:!hideRule })} data-code={item.codeNumber}>
                        <p className="downrow-no">NO.{item.codeNumber || '000000000000000'}</p>
                        <p className="downrow-item">{couponHelper.formateInstruction(item.instructions)}</p>
                        <p className="downrow-item">
                          {
                            renderWeek ?
                              <span>仅限{renderWeek.substring(0, renderWeek.length - 1)}</span>
                            :
                              <span>整周</span>
                          }可用
                        </p>
                        <p className="downrow-item">{item.usableCommercialDesc}</p>
                      </div>
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
