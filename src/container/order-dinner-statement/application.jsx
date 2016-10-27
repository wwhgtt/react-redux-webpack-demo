const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order-dinner-statement/order-dinner-statement.js');
const helper = require('../../helper/order-helper');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const Toast = require('../../component/mui/toast.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
/*
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
*/
const OrderSummary = require('../../component/order/order-summary.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
const defaultShopLogo = require('../../asset/images/default.png');
require('../../component/order/order-summary.scss'); // import option-shop styles
require('../../asset/style/style.scss');
require('../order/application.scss');

const OrderDinnerStateMentApplication = React.createClass({
  displayName: 'OrderDinnerStateMentApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrder:React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    fetchOrderCoupons:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    setChildView: React.PropTypes.func.isRequired,
    submitDinnerOrder:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    errorMessage:React.PropTypes.string,
    childView: React.PropTypes.string,
  },
  getInitialState() {
    return {
      receipt:null,
    };
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    this.setChildViewAccordingToHash();
    const { fetchOrder, fetchOrderDiscountInfo, fetchOrderCoupons } = this.props;
    fetchOrder().then(
      fetchOrderDiscountInfo
    )
    .then(fetchOrderCoupons)
    .then(
      () => { this.setChildViewAccordingToHash(); }
    );
  },
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },
  noteOrReceiptChange(evt) {
    const value = evt.target.value;
    this.setState({
      receipt:value,
    });
  },
  submitDinnerOrder(orderedDishesProps, serviceProps, commercialProps) {
    const { submitDinnerOrder } = this.props;
    let needPayMoney = 0;
    if (serviceProps.benefitProps.isPriviledge) {
      needPayMoney = serviceProps.benefitProps.extraPrice
      + helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
      - serviceProps.benefitProps.priviledgeAmount;
    } else {
      needPayMoney = helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps);
    }
    const receipt = this.state.receipt || this.props.commercialProps.receipt;
    submitDinnerOrder(needPayMoney, receipt);
  },
  render() {
    const { commercialProps, customerProps, serviceProps, orderedDishesProps, childView, errorMessage } = this.props; // state
    const { setOrderProps, clearErrorMsg } = this.props;// actions
    return (
      <div className="application">
        <div className="options-group">
          <a className="option option-shop">
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
          {serviceProps.couponsProps.couponsList && serviceProps.couponsProps.couponsList.length && !serviceProps.benefitProps.isPriviledge
            && helper.getCouponsLength(serviceProps.couponsProps.couponsList) !== 0 && serviceProps.discountProps.isMember ?
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
          {/* serviceProps.integralsInfo ?
            <ActiveSelect
              optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false */}
        </div>

        <div className="options-group">
          {commercialProps && commercialProps.isSupportReceipt === 1 ?
            <label className="option">
              <span className="option-title">发票抬头: </span>
              <input
                className="option-input"
                name="receipt"
                maxLength="35"
                disabled={commercialProps.receipt}
                placeholder={commercialProps.receipt || '如需发票请填写'}
                onChange={this.noteOrReceiptChange}
              />
            </label>
            :
            false
          }
        </div>

        <OrderSummary
          serviceProps={serviceProps} orderedDishesProps={orderedDishesProps}
          commercialProps={commercialProps} shopId={getUrlParam('shopId')}
          isNeedShopMaterial={false}
        />

        {orderedDishesProps.dishes && orderedDishesProps.dishes.length ?
          <div className="order-cart flex-none" style={{ position:'fixed', bottom: '0px', width:'100%' }}>
            <div className="order-cart-left">
              <div className="vertical-center clearfix">
                {commercialProps.carryRuleVO ?
                  <div>
                    <div className="order-cart-entry text-dove-grey">已优惠:&nbsp;
                      <span className="price">
                        {serviceProps.benefitProps.isPriviledge ?
                          serviceProps.benefitProps.priviledgeAmount
                          :
                          helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)
                        }
                      </span>
                    </div>
                    <div className="order-cart-entry">
                      <span className="text-dove-grey">待支付: </span>
                      <span className="order-cart-price price">
                        {serviceProps.benefitProps.isPriviledge ?
                          serviceProps.benefitProps.extraPrice
                          + helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
                          - serviceProps.benefitProps.priviledgeAmount
                          :
                          helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
                        }
                      </span>
                    </div>
                  </div>
                  :
                  false
                }
              </div>
            </div>
            <div className="order-cart-right">
              <a
                className="order-cart-btn btn--orange"
                onTouchTap={evt => this.submitDinnerOrder(orderedDishesProps, serviceProps, commercialProps)}
              >结账</a>
            </div>
          </div>
          :
          false
        }

        {childView === 'coupon-select' ?
          <CouponSelect couponsProps={serviceProps.couponsProps} onSelectCoupon={setOrderProps} />
          : false
        }

        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }

      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderDinnerStateMentApplication);
