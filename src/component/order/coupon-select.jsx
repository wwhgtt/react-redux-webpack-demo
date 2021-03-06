const React = require('react');
const ActiveSelect = require('../mui/select/active-select.jsx');
require('./coupon.scss');

const CouponOption = require('./coupon-option.jsx');
module.exports = React.createClass({
  displayName: 'CouponSelect',
  propTypes: {
    couponsProps:React.PropTypes.object.isRequired,
    onSelectCoupon:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      couponDataId:'',
    };
  },
  componentDidMount() {

  },
  onSelectCoupon(evt, optionData) {
    // when clicking on coupon dropdown trigger, do nothing
    if (evt.target.className.indexOf('coupon-dropdown-trigger') === -1) {
      const { onSelectCoupon } = this.props;
      const selectedCouponId = evt.currentTarget.getAttribute('data-id');
      const setCouponProp = {
        id:'coupon-prop',
        changedCouponId:selectedCouponId,
        isChecked:optionData.isChecked,
      };
      onSelectCoupon(null, setCouponProp);
      this.setState({
        couponDataId:selectedCouponId,
      });
      evt.preventDefault();
      evt.stopPropagation();
    }
  },
  onSubmitBtnTap() {
    const { onSelectCoupon, couponsProps } = this.props;
    const { couponDataId } = this.state;
    const selectedCoupon = couponsProps.couponsList.filter(coupon => coupon.isChecked);
    const selectedCouponId = selectedCoupon && selectedCoupon.length ?
          couponsProps.couponsList.filter(coupon => coupon.isChecked)[0].id.toString()
          :
          couponDataId;
    const selectedCouponData = {
      id:'coupon',
      selectedCouponId,
    };
    onSelectCoupon(null, selectedCouponData);
    window.location.hash = 'selectCoupon';
  },
  render() {
    const { couponsProps } = this.props;
    return (
      <div className="subpage flex-columns">
        <div className="coupons-container flex-rest">
          <ActiveSelect
            optionsData={couponsProps.couponsList}
            onSelectOption={this.onSelectCoupon}
            optionComponent={CouponOption}
          />
        </div>
        <button className="subpage-submit-btn btn--yellow flex-none" onClick={this.onSubmitBtnTap}>确定</button>
      </div>
    );
  },
});
