const React = require('react');

require('./coupon.scss');

const CouponDetail = require('./coupon-detail.jsx');
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
  onSelectCoupon(evt) {
    const selectedCouponId = evt.currentTarget.getAttribute('data-id');
    this.setState({
      couponDataId:selectedCouponId,
    });
  },
  onSubmitBtnTap() {
    const { onSelectCoupon } = this.props;
    const { couponDataId } = this.state;
    const selectedCouponData = {
      id:'selected-coupon-data',
      selectedCouponId:couponDataId,
    };
    onSelectCoupon(null, selectedCouponData);
  },
  render() {
    const { couponsProps } = this.props;
    return (
      <div className="order-subpage">
        <header className="tab-bars">
          <ul className="flex-row">
            <li className="tab-bar flex-rest active">未使用</li>
            <li className="tab-bar flex-rest">未使用</li>
            <li className="tab-bar flex-rest">未使用</li>
          </ul>
        </header>
        {couponsProps.couponsList.map(
          couponList => (
            <CouponDetail couponData={couponList} id={couponList.id} key={couponList.id} onSelectCoupon={this.onSelectCoupon} />
          )
        )}
        <button className="order-subpage-submit btn--yellow" onTouchTap={this.onSubmitBtntap}>确定</button>
      </div>
    );
  },
});
