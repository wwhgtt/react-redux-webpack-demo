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
    const { onSelectCoupon } = this.props;
    const selectedCouponId = evt.currentTarget.getAttribute('data-id');
    const setCouponProp = {
      id:'coupon-prop',
      changedCouponId:selectedCouponId,
    };
    onSelectCoupon(null, setCouponProp);
    this.setState({
      couponDataId:selectedCouponId,
    });
  },
  onSubmitBtnTap() {
    const { onSelectCoupon } = this.props;
    const { couponDataId } = this.state;
    const selectedCouponData = {
      id:'coupon',
      selectedCouponId:couponDataId,
    };
    onSelectCoupon(null, selectedCouponData);
    window.location.hash = '';
  },
  render() {
    const { couponsProps } = this.props;
    return (
      <div className="order-subpage coupons-container">
        <ActiveSelect
          optionsData={couponsProps.couponsList}
          onSelectOption={this.onSelectCoupon}
          optionComponent={CouponOption}
        />
        <button className="order-subpage-submit btn--yellow" onClick={this.onSubmitBtnTap}>确定</button>
      </div>
    );
  },
});
