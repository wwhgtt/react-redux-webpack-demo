const React = require('react');

module.exports = React.createClass({
  displayName: 'CouponDetail',
  propTypes: {
    couponData:React.PropTypes.object.isRequired,
    onSelectCoupon:React.PropTypes.func.isRequired,
    id:React.PropTypes.number.isRequired,
  },
  getInitialState() {
    return {
      isInstructionsOpen:false,
    };
  },
  componentDidMount() {

  },
  judgeCouponNameByCouponType(couponType) {
    let couponName = '';
    if (couponType === 1) {
      couponName = '满减券';
    } else if (couponType === 2) {
      couponName = '折扣券';
    } else if (couponType === 3) {
      couponName = '礼品券';
    } else {
      couponName = '现金券';
    }
    return couponName;
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
  render() {
    const { couponData, onSelectCoupon, id } = this.props;
    const { isInstructionsOpen } = this.state;
    return (
      <div className="coupon">
        <div className="coupon-card flex-row" data-id={id} onTouchTap={onSelectCoupon}>
          <div className="coupon-card-left">
            <div className="coupon-rate">{couponData.coupRuleBeanList[0].ruleValue}</div>
            <p className="coupon-text--grey">{couponData.ruleDesc}</p>
          </div>
          <div className="coupon-card-right flex-rest">
            <h3 className="coupon-title">{this.judgeCouponNameByCouponType(couponData.couponType)}</h3>
            <p className="coupon-text--grey">有效期: {couponData.validStartDate}-{couponData.validEndDate}</p>
            <button className="coupon-text--dark coupon-dropdown-trigger" onTouchTap={this.expandInstructions}>
              {this.judgeCouponNameByCouponType(couponData.couponType)}使用规则
            </button>
            <a className="coupon-go-order" href="">去点菜</a>
          </div>
          <div className="coupon-flag"></div>
        </div>
        {isInstructionsOpen ?
          <div className="coupon-dropdown">
            <p className="coupon-text--dark">NO.{couponData.codeNumber}</p>
            <ol className="coupon-rules">
              <li className="coupon-text--grey">{this.deleteHtmlTag(couponData.instructions)}</li>
            </ol>
          </div> : false
        }
      </div>
    );
  },
});
