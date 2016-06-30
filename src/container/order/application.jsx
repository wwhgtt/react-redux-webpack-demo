const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
require('../../asset/style/style.scss');
require('./application.scss');
import ActiveSelect from '../../component/mui/select/active-select.jsx';
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');

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
  expandCustomerInfoEditor(evt) {
    const { setOrderProps } = this.props;
    setOrderProps(null, 'isCustomerInfoEditorOpen');
    evt.preventDefault();
  },
  render() {
    const { customerProps, serviceProps } = this.props; // states
    const { setOrderProps } = this.props;// actions
    return (
      <div className="application">
        <div className="options-group options-group--stripes" onTouchTap={this.expandCustomerInfoEditor}>
          <h2 className="customer-name">
            <span>{customerProps.name}</span>
            <span>{customerProps.sex === '1' ? '先生' : '女士'}</span>
          </h2>
          <h2 className="customer-extra-info">
            <span>{customerProps.mobile}</span>
            <span>{customerProps.customerCount}人就餐</span>
          </h2>
        </div>

        <div className="options-group">
          {serviceProps.isPickupFromFrontDesk ?
            <ActiveSelect
              optionsData={[serviceProps.isPickupFromFrontDesk]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
            : false
          }
        </div>

        <div className="options-group">
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

        <div className="options-group">
          {serviceProps.couponsProps.couponsList.length && !serviceProps.discountProps.discountInfo.isChecked ?
            <div className="order-prop-option">
              <span>使用优惠券</span>
              <span className="badge-coupon">
                {serviceProps.couponsProps.inUseCoupon ?
                  '模拟折扣券'
                  :
                  `${serviceProps.couponsProps.couponsList.length}张可用`
                }
              </span>
              <button className="order-option-btn btn-arrow-right">{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</button>
            </div>
          : false}
          {serviceProps.discountProps.discountInfo && !serviceProps.couponsProps.inUseCoupon ?
            <ActiveSelect
              optionsData={[serviceProps.discountProps.discountInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false}
          {serviceProps.integralsInfo ?
            <ActiveSelect
              optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false}
        </div>

        <div className="options-group">
          <label className="order-prop-option">
            <span>备注:</span>
            <input className="order-option-input" name="note" placeholder="输入备注" />
          </label>
          <label className="order-prop-option">
            <span>发票抬头:</span>
            <input className="order-option-input" name="invoice" placeholder="输入个人或公司抬头" />
          </label>
        </div>
        {serviceProps.isCustomerInfoEditorOpen ?
          <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setOrderProps} />
          : false}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
