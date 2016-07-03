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
      <div className="coupon-info" data-id={id} onTouchTap={onSelectCoupon}>
        <div className="coupons-container">
          <div className="coupon-card flex-row">
            <div className="coupon-card-left">
              <div className="coupon-rate">50</div>
              <p className="coupon-text--grey">消费满200元可用</p>
            </div>
            <div className="coupon-card-right flex-rest">
              <h3 className="coupon-title">券</h3>
              <p className="coupon-text--grey">有效期: 2015</p>
              <button className="coupon-text--dark coupon-dropdown-trigger">折扣券使用规则</button>
              <a className="coupon-go-order" href="">去点菜</a>
            </div>
            <div className="coupon-flag"></div>
          </div>
          <div className="coupon-dropdown">
            <p className="coupon-text--dark">NO.123123123</p>
            <ol className="coupon-rules">
              <li className="coupon-text--grey">至此</li>
              <li className="coupon-text--grey">至此</li>
              <li className="coupon-text--grey">至此</li>
            </ol>
          </div>
        </div>

        <span classNmae="coupon-type">
          {this.judgeCouponNameByCouponType(couponData.couponType)}
        </span>
        <p className="coupon-period-of-validity">
          <span>有效期</span>
          <span>{couponData.validStartDate}</span>
          <span>-</span>
          <span>{couponData.validEndDate}</span>
        </p>
        <p onTouchTap={this.expandInstructions}>{this.judgeCouponNameByCouponType(couponData.couponType)}使用规则</p>
        <div className="coupon-rule-detaile">
          <span>{couponData.coupRuleBeanList[0].ruleValue}</span>
          <p>{couponData.ruleDesc}</p>
        </div>
        {isInstructionsOpen ?
          <div className="coupon-instructions-detaile">
            <span>NO.{couponData.codeNumber}</span>
            <p>{this.deleteHtmlTag(couponData.instructions)}</p>
          </div> : false
        }
      </div>
    );
  },
});
