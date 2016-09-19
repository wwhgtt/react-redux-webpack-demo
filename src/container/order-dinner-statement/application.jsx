const React = require('react');
const connect = require('react-redux').connect;
const config = require('../../config.js');
const actions = require('../../action/order-dinner-statement/order-dinner-statement.js');
const helper = require('../../helper/order-helper');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
// const Toast = require('../../component/mui/toast.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const defaultShopLogo = require('../../asset/images/default.png');
require('../../component/order/order-summary.scss'); // import option-shop styles
require('../../asset/style/style.scss');
require('./application.scss');

const OrderDinnerStateMentApplication = React.createClass({
  displayName: 'OrderDinnerStateMentApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrder:React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    submitOrder:React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    fetchOrderCoupons:React.PropTypes.func.isRequired,
    fetchLastOrderedDishes:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    errorMessage:React.PropTypes.string,
  },
  componentWillMount() {
    const { fetchLastOrderedDishes } = this.props;
    fetchLastOrderedDishes();
  },
  componentDidMount() {
    const { fetchOrder, fetchOrderDiscountInfo, fetchOrderCoupons } = this.props;
    fetchOrder().then(
      fetchOrderDiscountInfo
    )
    .then(fetchOrderCoupons);
  },
  render() {
    const { commercialProps, customerProps, serviceProps } = this.props; // state
    const { setOrderProps } = this.props;// actions
    return (
      <div className="application">
        <div className="options-group">
          <a className="option option-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
            <img className="option-shop-icon" src={commercialProps.shopLogo || defaultShopLogo} alt="" />
            <p className="option-shop-desc ellipsis">{commercialProps.shopName}</p>
          </a>
          <div className="option">
            <DiningOptions
              dineSerialNumber={customerProps.dineSerialNumber || 110}
              dineCount={customerProps.dineCount || 1}
              dineTableProp={{ area:customerProps.dineTableProp.area, table:customerProps.dineTableProp.table }}
            />
          </div>
        </div>
        <div className="options-group">
          {serviceProps.couponsProps.couponsList && serviceProps.couponsProps.couponsList.length
            && helper.getCouponsLength(serviceProps.couponsProps.couponsList) !== 0 && commercialProps.diningForm !== 0 ?
            <a className="option" href="#coupon-select">
              <span className="option-title">使用优惠券</span>
              <span className="badge-coupon">
                {serviceProps.couponsProps.inUseCoupon ?
                  '已使用一张优惠券'
                  :
                  `${helper.getCouponsLength(serviceProps.couponsProps.couponsList)}张可用`
                }
              </span>
              <span className="option-btn btn-arrow-right">{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</span>
            </a>
          : false}
          {serviceProps.integralsInfo ?
            <ActiveSelect
              optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false}
        </div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderDinnerStateMentApplication);
