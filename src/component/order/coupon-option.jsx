const React = require('react');
const classnames = require('classnames');
module.exports = React.createClass({
  displayName: 'CouponOption',
  propTypes: {
    instructions:React.PropTypes.string.isRequired,
    coupRuleBeanList:React.PropTypes.array.isRequired,
    ruleDesc:React.PropTypes.string.isRequired,
    couponType:React.PropTypes.number.isRequired,
    validStartDate:React.PropTypes.any.isRequired,
    validEndDate:React.PropTypes.any.isRequired,
    codeNumber:React.PropTypes.number.isRequired,
    onTouchTap:React.PropTypes.func.isRequired,
    isChecked:React.PropTypes.bool,
  },
  getInitialState() {
    return {
      isInstructionsOpen:false,
    };
  },
  componentDidMount() {

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
      identifyCouponInfo.couponName = '现金券';
      identifyCouponInfo.classNameForCoupon = 'coupon-xianjin';
    }
    return identifyCouponInfo;
  },
  expandInstructions(evt) {
    const { isInstructionsOpen } = this.state;
    this.setState({
      isInstructionsOpen:!isInstructionsOpen,
    });
    evt.preventDefault();
  },
  deleteHtmlTag(html) {
    const reg = new RegExp('<[^<]*>', 'gi');
    return html.replace(reg, '');
  },
  composeGiftCouponProps(giftCoupons) {
    let gift = { name:'', number:'' };
    giftCoupons.map(coupon => {
      if (coupon.ruleName === 'giftName') {
        gift.name = coupon.ruleValue;
      } else if (coupon.ruleName === 'giftNumber') {
        gift.number = coupon.ruleValue;
      }
      return gift;
    });
    const giftElement = (<div className="coupon-rate" data-gift-amount={gift.number}>{gift.name}</div>);
    return giftElement;
  },
  render() {
    const { instructions, coupRuleBeanList, ruleDesc, couponType, validStartDate, codeNumber, validEndDate, isChecked, ...otherProps } = this.props;
    const { isInstructionsOpen } = this.state;
    return (
      <div
        className={classnames('coupon', this.judgeCouponInfoByCouponType(couponType).classNameForCoupon)}
        {...otherProps}
      >
        <div className="coupon-card flex-row" >
          <div className="coupon-card-left">
            {couponType === 3 ?
              this.composeGiftCouponProps(coupRuleBeanList)
              :
              <div className="coupon-rate">{coupRuleBeanList[0].ruleValue}</div>
            }
            <p className="coupon-text--grey">{ruleDesc}</p>
          </div>
          <div className="coupon-card-right flex-rest">
            <h3 className="coupon-title">
              {this.judgeCouponInfoByCouponType(couponType).couponName}
            </h3>
            <p className="coupon-text--grey">有效期: {validStartDate}-{validEndDate}</p>
            <button className="coupon-text--dark coupon-dropdown-trigger" onTouchTap={this.expandInstructions}>
              {this.judgeCouponInfoByCouponType(couponType).couponName}使用规则
            </button>
            <a className="coupon-go-order" href="">去点菜</a>
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
            <ol className="coupon-rules">
              <li className="coupon-text--grey">{this.deleteHtmlTag(instructions)}</li>
            </ol>
          </div> : false
        }
      </div>
    );
  },
});
