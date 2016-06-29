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
    const { setOrderProps } = this.props;// actions
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
          {serviceProps.payMethods.map(
            payMethod => {
              if (payMethod.isAvaliable !== -1) {
                return (<ActiveSelect
                  optionsData={[payMethod]} key={payMethod.id} onSelectOption={setOrderProps}
                  optionComponent={OrderPropOption}
                />);
              }
              return true;
            }
          )}
        </div>
        <div className="coupons-or-isMembers">
          {serviceProps.couponsProps.couponsList.length && !serviceProps.discountProps.discountInfo.isChecked ?
            <a className="coupons">
              <span>使用优惠券</span>
              <span>
                {serviceProps.couponsProps.inUseCoupon ?
                  '模拟折扣券'
                  :
                  `${serviceProps.couponsProps.couponsList.length}张可用`
                }
              </span>
              <span>{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</span>
            </a>
          : false}
          {serviceProps.discountProps.discountInfo && !serviceProps.couponsProps.inUseCoupon ?
            <div className="discount">
              <ActiveSelect
                optionsData={[serviceProps.discountProps.discountInfo]} onSelectOption={setOrderProps}
                optionComponent={OrderPropOption}
              />
            </div>
          : false}
          {serviceProps.integralsInfo ?
            <div className="integrals">
              <ActiveSelect
                optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
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
