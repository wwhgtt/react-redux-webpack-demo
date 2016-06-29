const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
require('../../asset/style/style.scss');
require('./application.scss');
import ActiveSelect from '../../component/mui/select/active-select.jsx';
const OrderPropOption = require('../../component/order/order-prop-option.jsx');

const OrderApplication = React.createClass({
  displayName: 'OrderApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrder:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    fetchOrderCoupons:React.PropTypes.func.isRequired,
    calculateOrderPrice:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
  },
  componentDidMount() {
    this.props.fetchOrder();
    this.props.fetchOrderDiscountInfo();
    this.props.fetchOrderCoupons();
  },
  componentDidUpdate() {
  },
  render() {
    const { customerProps, serviceProps } = this.props; // states
    const { setOrderProps, calculateOrderPrice } = this.props;// actions
    return (
      <div className="application">
        <div className="customer-info">
          <h2 className="customer-name">
            <span>{customerProps.name}</span>
            <span>{customerProps.sex === '1' ? '先生' : '女士'}</span>
          </h2>
          <h2 className="customer-extra-info">
            <span>{customerProps.mobile}</span>
            <span>{customerProps.customerCount}人就餐</span>
          </h2>
        </div>
        <div className="eat-in-or-take-away">
          {serviceProps.isPickupFromFrontDesk ?
            <ActiveSelect
              optionsData={[serviceProps.isPickupFromFrontDesk]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
            : false
          }
        </div>
        <div className="order-pay-method">
          <ActiveSelect
            optionsData={serviceProps.payMethods} onSelectOption={setOrderProps}
            optionComponent={OrderPropOption}
          />
        </div>
        <div className="coupons-or-isMembers">
          {serviceProps.couponsProps.couponsList ?
            <div className="coupons">
              <span>使用优惠券</span>
              <span>{serviceProps.couponsProps.couponsList.length}张可用</span>
            </div>
          : false}
          {serviceProps.discountProps.isDiscountAvailable ?
            <div className="coupons">
              <ActiveSelect
                optionsData={[serviceProps.discountProps.isDiscountAvailable]} onSelectOption={calculateOrderPrice}
                optionComponent={OrderPropOption}
              />
            </div>
          : false}
          {serviceProps.isIntegralsAvailable ?
            <div className="integrals">
              <ActiveSelect
                optionsData={[serviceProps.isIntegralsAvailable]} onSelectOption={calculateOrderPrice}
                optionComponent={OrderPropOption}
              />
            </div>
          : false}
        </div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
