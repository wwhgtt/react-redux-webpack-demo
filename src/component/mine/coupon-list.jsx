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
    return { showCode:0, couponCanUseList:[], couponOutOfDateList:[], couponCanNotUseList:[] };
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {
    const { couponList } = this.props;
    if (nextProps.couponList && nextProps.couponList.length !== 0 && couponList !== nextProps.couponList) {
      this.setState({
        couponCanUseList:couponHelper.filterCouponListByStatus(nextProps.couponList, 1),
        couponOutOfDateList:couponHelper.filterCouponListByStatus(nextProps.couponList, 3),
        couponCanNotUseList:couponHelper.filterCouponListByStatus(nextProps.couponList, 2),
      });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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
    const { showCode, couponCanUseList, couponOutOfDateList, couponCanNotUseList } = this.state;
    let filterCouponList = [];
    if (couponStatus === 1) {
      filterCouponList = couponCanUseList;
    } else if (couponStatus === 2) {
      filterCouponList = couponCanNotUseList;
    } else if (couponStatus === 3) {
      filterCouponList = couponOutOfDateList;
    }
    if (filterCouponList.length === 0) {
      return (
        <div className="no-coupon-outer">
          <img src={noCouponLogo} alt="暂无数据" className="noCouponLogo" />
          暂无优惠券
        </div>
      );
    }
    return (
      <div className="coupon-outer">
        {
          filterCouponList.map((item, index) => {
            let ruleVale = '';
            let typeClass = '';
            let typeUnit = '';
            let giftTypeUnit = '';
            let giftFontSize = '';
            let statusWord = '';
            let hide = true;
            let dateBlock = '';
            const renderWeek = commonHelper.renderDay(item.week);

            if (showCode === item.codeNumber) {
              hide = false;
            }
            item.coupRuleBeanList.forEach((itemInner, indexInner) => {
              if (item.couponType === 1 && itemInner.ruleName === 'offerValue') {
                ruleVale = itemInner.ruleValue || '--';
              }
              if (item.couponType === 2 && itemInner.ruleName === 'zkValue') {
                ruleVale = itemInner.ruleValue || '--';
              }
              if (item.couponType === 3 && itemInner.ruleName === 'giftName') {
                ruleVale = itemInner.ruleValue || '--';
              }
              if (item.couponType === 4 && itemInner.ruleName === 'faceValue') {
                ruleVale = itemInner.ruleValue || '--';
              }
            });
            switch (item.couponType) {
              case 1: typeClass = 'manjian'; typeUnit = '元 满减券'; break;
              case 2: typeClass = 'zhekou'; typeUnit = '折 折扣券'; break;
              case 3: typeClass = 'lipin'; giftTypeUnit = '送'; giftFontSize = '1.4em'; break;
              case 4: typeClass = 'xianjin'; typeUnit = '元 现金券'; break;
              default:break;
            }
            if (couponStatus !== 1) {
              typeClass = 'shixiao';
              statusWord = couponStatus === 3 ? '已过期' : '已使用';
              if (couponStatus === 3) {
                dateBlock = (
                  <div>
                    <span className="validity-date">{couponHelper.formateDate(item.validEndDate)}</span>
                  </div>
                );
              } else {
                dateBlock = (
                  <span className="validity-date">{couponHelper.formateOriginDate(item.checkTime)}</span>
                );
              }
            } else {
              statusWord = '有效期';
              dateBlock = (
                <div>
                  <span className="validity-date">{couponHelper.formateDate(item.validStartDate)}</span>
                  <span className="validity-date">{couponHelper.formateDate(item.validEndDate)}</span>
                </div>
              );
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
                        代金券使用规则<span className={classnames({ arrowup:!hide, arrowdown:hide })}></span>
                      </p>
                    </div>
                  </div>
                  <div className="uprow-rightpart">
                    <p className="validity">{statusWord}</p>
                    {dateBlock}
                  </div>
                </div>
                <div className={classnames('downrow of', { show:!hide })} data-code={item.codeNumber}>
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
  },
});
