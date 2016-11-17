const React = require('react');
const classnames = require('classnames');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const getRelatedToDishCouponProps = require('../../helper/order-helper.js').getRelatedToDishCouponProps;
module.exports = React.createClass({
  displayName: 'CouponOption',
  propTypes: {
    instructions:React.PropTypes.string.isRequired,
    coupRuleBeanList:React.PropTypes.array.isRequired,
    coupDishBeanList:React.PropTypes.array.isRequired,
    fullValue:React.PropTypes.any.isRequired,
    couponType:React.PropTypes.number.isRequired,
    validStartDate:React.PropTypes.any.isRequired,
    validEndDate:React.PropTypes.any.isRequired,
    codeNumber:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    id:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    onTouchTap:React.PropTypes.func.isRequired,
    periodStart:React.PropTypes.any.isRequired,
    periodEnd:React.PropTypes.any.isRequired,
    isChecked:React.PropTypes.bool,
    weixinValue: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  },
  getInitialState() {
    return {
      isInstructionsOpen:false,
    };
  },
  componentDidMount() {

  },
  getCouponValue(couponType, coupRuleBeanList) {
    const { weixinValue } = this.props;
    if (weixinValue) {
      return weixinValue;
    } else if (coupRuleBeanList && coupRuleBeanList.length) {
      let ruleValue = '';
      coupRuleBeanList.map(coupon => {
        if (couponType === 1 && coupon.ruleName === 'offerValue') {
          ruleValue = coupon.ruleValue;
        } else if (couponType === 2 && coupon.ruleName === 'zkValue') {
          ruleValue = coupon.ruleValue;
        } else if (couponType === 4 && coupon.ruleName === 'faceValue') {
          ruleValue = coupon.ruleValue;
        }
        return true;
      });
      return ruleValue;
    }
    return false;
  },
  judgeCouponInfoByCouponType(couponType) {
    let identifyCouponInfo = { couponName:'', classNameForCoupon:'' };
    if (couponType === 1) {
      identifyCouponInfo.couponName = '满减券';
      identifyCouponInfo.classNameForCoupon = 'coupon-manjian';
    } else if (couponType === 2) {
      identifyCouponInfo.couponName = '折扣券';
      identifyCouponInfo.classNameForCoupon = 'coupon-zhekou';
    } else if (couponType === 3) {
      identifyCouponInfo.couponName = '礼品券';
      identifyCouponInfo.classNameForCoupon = 'coupon-lipin';
    } else {
      identifyCouponInfo.couponName = '代金券';
      identifyCouponInfo.classNameForCoupon = 'coupon-xianjin';
    }
    return identifyCouponInfo;
  },
  judgeCouponAvaliabl(coupRuleBeanList, coupDishBeanList) {
    const { weixinValue } = this.props;
    if (coupDishBeanList.length && getRelatedToDishCouponProps(coupDishBeanList[0]).name) {
      return true;
    }
    if (coupRuleBeanList.length) {
      if (coupDishBeanList.length) {
        return getRelatedToDishCouponProps(coupDishBeanList[0]).name;
      }
      // 代表普通优惠券
      return true;
    }
    if (!coupRuleBeanList.length && !coupDishBeanList.length && weixinValue) {
      return true;
    }
    // 表明优惠券不可用  应该隐藏掉
    return false;
  },
  expandInstructions(evt) {
    const { isInstructionsOpen } = this.state;
    this.setState({
      isInstructionsOpen:!isInstructionsOpen,
    });
    evt.preventDefault();
  },
  deleteHtmlTag(html) {
    if (html) return html.replace(/<.+?>/g, '').replace(/&nbsp;/g, '');
    return false;
  },
  composeGiftCouponProps(coupRuleBeanList, coupDishBeanList) {
    if (coupRuleBeanList.length && !coupDishBeanList.length) {
      let gift = { name:'', number:'' };
      coupRuleBeanList.map(coupon => {
        if (coupon.ruleName === 'giftName') {
          gift.name = coupon.ruleValue;
        } else if (coupon.ruleName === 'giftNumber') {
          gift.number = coupon.ruleValue;
        }
        return gift;
      });
      const giftElement = (<div className="coupon-rate">
        <span className="coupon-value coupon-gift" data-gift-amount={gift.number}>{gift.name}</span>
        <span className="coupon-title">礼品券</span>
      </div>);
      return giftElement;
    }
    const giftElement = (<div className="coupon-rate" data-gift-amount={getRelatedToDishCouponProps(coupDishBeanList[0]).number}>
        {coupDishBeanList[0].dishName || getRelatedToDishCouponProps(coupDishBeanList[0]).name}
    </div>);
    return giftElement;
  },
  bulidInstructions(instructions) {
    const rawInstructions = instructions
      .replace(/<\/(h[1-6]|p|li)>/g, '</$1>\n')
      .replace(/<\/?.+?>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, '');
    return (
      <ul className="coupon-rules">
        {rawInstructions.split('\n').map(
          (entry, index) => {
            if (entry && entry.trim().length) {
              return <li key={index}>{entry}</li>;
            }
            return false;
          }
          )}
      </ul>
    );
  },
  render() {
    const { instructions, coupRuleBeanList, coupDishBeanList, fullValue, periodStart, periodEnd, weixinValue,
            couponType, validStartDate, codeNumber, validEndDate, isChecked, onTouchTap, id } = this.props;
    const { isInstructionsOpen } = this.state;
    if (!this.judgeCouponAvaliabl(coupRuleBeanList, coupDishBeanList)) return false;
    return (
      <div
        className="coupon"
        onTouchTap={onTouchTap} data-id={id}
      >
        <div className="coupon-card flex-row" >
          <div className={classnames('coupon-card-left', this.judgeCouponInfoByCouponType(couponType).classNameForCoupon)}>
            {couponType === 3 ?
              this.composeGiftCouponProps(coupRuleBeanList, coupDishBeanList)
              :
              <div className="coupon-rate">
                <span className="coupon-value">{this.getCouponValue(couponType, coupRuleBeanList)}</span>
                <span className="coupon-title">{this.judgeCouponInfoByCouponType(couponType).couponName}</span>
                {weixinValue ?
                  <span className="coupon-weixin"></span>
                  :
                  false
                }
              </div>
            }
            <p className="coupon-text--grey">
              <span>消费满{fullValue}可用</span>
              <span>({String(periodStart).substr(0, 5)}～{String(periodEnd).substr(0, 5)})</span>
            </p>
            <button
              className={
                classnames('coupon-text--dark coupon-dropdown-trigger',
                  { 'is-open': this.state.isInstructionsOpen, 'for-gift': this.judgeCouponInfoByCouponType(couponType).couponName === '礼品券' }
                )
              }
              onTouchTap={this.expandInstructions}
            >
              {this.judgeCouponInfoByCouponType(couponType).couponName}使用规则
            </button>
          </div>
          <div className="coupon-card-right flex-rest">
            <h3 className="coupon-time">
              有效期
            </h3>
            <p className="coupon-text--grey">{dateUtility.format(new Date(validStartDate), 'yyyy/MM/dd')}</p>
            <p className="coupon-text--grey">{dateUtility.format(new Date(validEndDate), 'yyyy/MM/dd')}</p>
            {/* <a className="coupon-go-order" href="">去点菜</a> */}
          </div>
          {isChecked ?
            <div className="coupon-flag"></div>
            :
            false
          }
        </div>
        {isInstructionsOpen ?
          <div className="coupon-dropdown">
            <p className="coupon-text--dark">NO.{codeNumber}</p>
            {this.bulidInstructions(instructions)}
          </div> : false
        }
      </div>
    );
  },
});
