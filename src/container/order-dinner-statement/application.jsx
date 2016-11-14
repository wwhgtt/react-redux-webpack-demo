const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order-dinner-statement/order-dinner-statement.js');
const helper = require('../../helper/order-helper');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const Toast = require('../../component/mui/toast.jsx');
const DiningOptions = require('../../component/order/dining-options.jsx');
const formatPrice = require('../../helper/common-helper.js').formatPrice;
const getDishesCount = require('../../helper/dish-hepler.js').getDishesCount;
const OrderSummary = require('../../component/order/order-summary.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
require('../../component/order/order-summary.scss'); // import option-shop styles
require('../../asset/style/style.scss');
require('../order/application.scss');
require('./application.scss');

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
    const { submitDinnerOrder, setErrorMsg } = this.props;
    if (!serviceProps.allowCheck) { setErrorMsg('请联系服务员结账'); return false; }
    let needPayMoney = 0;
    if (serviceProps.benefitProps.isPriviledge) {
      needPayMoney = serviceProps.benefitProps.extraPrice
      + helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
      - serviceProps.benefitProps.priviledgeAmount;
    } else {
      needPayMoney = helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps);
    }
    const receipt = this.state.receipt || this.props.commercialProps.receipt;
    return submitDinnerOrder(needPayMoney, receipt);
  },
  render() {
    const { commercialProps, customerProps, serviceProps, orderedDishesProps, childView, errorMessage } = this.props; // state
    const { setOrderProps, clearErrorMsg } = this.props;// actions
    const hasPriviledge = commercialProps.hasPriviledge;
    return (
      <div className="application">
        <div className="options-group options-head">
          <a className="option option-shop">
            <p className="option-shop-desc ellipsis">{commercialProps.shopName}</p>
          </a>
          <DiningOptions
            dineSerialNumber={customerProps.dineSerialNumber || 110}
            dineCount={customerProps.dineCount || 1}
            dineTableProp={{ area:customerProps.dineTableProp.area, table:customerProps.dineTableProp.table }}
          />
        </div>
        <div className="extra-supplement">
          <span className="left">已选菜品</span>
          <span className="right">共{getDishesCount(orderedDishesProps.dishes)}份</span>
        </div>

        <OrderSummary
          serviceProps={serviceProps} orderedDishesProps={orderedDishesProps}
          commercialProps={commercialProps} shopId={getUrlParam('shopId')}
          isNeedShopMaterial={false} setOrderProps={setOrderProps}
        />

        {commercialProps && commercialProps.isSupportReceipt === 1 ?
          <div className="options-group margin-cart-bottom">
            <label className="option">
              <span className="option-title">发票: </span>
              <input
                className="option-input"
                name="receipt"
                maxLength="35"
                disabled={commercialProps.receipt || serviceProps.benefitProps.isPriviledge || hasPriviledge}
                placeholder={commercialProps.receipt || (hasPriviledge ? '已经有优惠不能输入' : '请输入个人或公司抬头')}
                onChange={this.noteOrReceiptChange}
              />
            </label>
          </div>
          :
          false
        }

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
                      <span className="text-dove-grey">还需付: </span>
                      <span className="order-cart-price price">
                        {serviceProps.benefitProps.isPriviledge ?
                          serviceProps.benefitProps.totalAmount
                          :
                          formatPrice(
                            helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
                          )
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
