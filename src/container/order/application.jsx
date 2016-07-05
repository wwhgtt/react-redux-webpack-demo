const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
// const TableSelect = require('../../component/order/select/table-select.jsx');
const OrderedDish = require('../../component/order/ordered-dish.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const helper = require('../../helper/order-helper.js');
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const _isEmpty = require('lodash').isEmpty;
require('../../asset/style/style.scss');
require('./application.scss');

const OrderApplication = React.createClass({
  displayName: 'OrderApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrder:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    fetchOrderCoupons:React.PropTypes.func.isRequired,
    setChildView: React.PropTypes.func.isRequired,
    getLastOrderedDishes:React.PropTypes.func.isRequired,
    orderSummary:React.PropTypes.object.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object.isRequired,
    childView: React.PropTypes.string,
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    const { fetchOrder, fetchOrderDiscountInfo, fetchOrderCoupons, getLastOrderedDishes } = this.props;
    getLastOrderedDishes();
    Promise.all([fetchOrder(), fetchOrderDiscountInfo(), fetchOrderCoupons()]).then(
      this.setChildViewAccordingToHash
    );
  },
  componentDidUpdate() {

  },
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },
  render() {
    const { customerProps, serviceProps, childView, tableProps, orderedDishesProps, commercialProps, orderSummary } = this.props; // states
    const { setOrderProps } = this.props;// actions
    return (
      <div className="application">
        <a className="options-group options-group--stripes" href="#customer-info" >
          <div className="option-stripes-title">{customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'}</div>
          <div className="clearfix">
            <div className="option-desc half">{customerProps.mobile}</div>
            <div className="option-desc half"><span className="text-picton-blue">{customerProps.customerCount}</span>人就餐</div>
          </div>
        </a>

        <div className="options-group">
          {serviceProps.isPickupFromFrontDesk ?
            <ActiveSelect
              optionsData={[serviceProps.isPickupFromFrontDesk]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
            : false
          }
          {serviceProps.isPickupFromFrontDesk.isChecked ?
            false
            :
            <a className="order-prop-option" href="#table-select" >
              <span className="options-title">选择桌台</span>
              <button className="option-btn btn-arrow-right">大厅区   桌台A021(2人桌)</button>
            </a>
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
            <a className="order-prop-option" href="#coupon-select">
              <span className="option-title">使用优惠券</span>
              <span className="badge-coupon">
                {serviceProps.couponsProps.inUseCoupon ?
                  '模拟折扣券'
                  :
                  `${serviceProps.couponsProps.couponsList.length}张可用`
                }
              </span>
              <button className="option-btn btn-arrow-right">{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</button>
            </a>
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
            <span className="option-title">备注:</span>
            <input className="option-input" name="note" placeholder="输入备注" />
          </label>
          <label className="order-prop-option">
            <span className="option-title">发票抬头:</span>
            <input className="option-input" name="invoice" placeholder="输入个人或公司抬头" />
          </label>
        </div>
        <div className="options-group">
          <a className="order-prop-option order-shop">
            <img className="order-shop-icon" src={commercialProps.commercialLogo} alt="" />
            <p className="order-shop-desc ellipsis">{commercialProps.name}</p>
          </a>
          {!_isEmpty(orderedDishesProps) && orderedDishesProps.dishes.length ?
            <div>
              {orderedDishesProps.dishes.map(dish => (<OrderedDish key={dish.id} dish={dish} />))}
              <div className="order-summary">
                {orderSummary.coupon ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">优惠券优惠:</span>
                    <span className="order-discount discount">{orderSummary.coupon}</span>
                  </p>
                  :
                  false
                }
                {!_isEmpty(orderedDishesProps) && serviceProps.integralsInfo.isChecked ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">积分抵扣:</span>
                    <span className="order-discount discount">
                    {helper.countIntegralsToCash(
                      getDishesPrice(orderedDishesProps.dishes),
                      orderSummary.coupon,
                      serviceProps.integralsInfo.integralsDetail
                    ).integralInUsed}
                    </span>
                    <span className="order-integral">
                      {helper.countIntegralsToCash(
                        getDishesPrice(orderedDishesProps.dishes),
                        orderSummary.coupon,
                        serviceProps.integralsInfo.integralsDetail
                      ).commutation}
                    </span>
                  </p>
                  :
                  false
                }
                {!_isEmpty(orderedDishesProps) && commercialProps.carryRuleVO ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">自动抹零:</span>
                    <span className="order-discount discount">{
                      helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
                    }</span>
                  </p>
                  :
                  false
                }
              </div>
              <p className="final-price">
                <span className="dishes-price">
                  总计:{getDishesPrice(orderedDishesProps.dishes)}
                </span>
                {commercialProps.carryRuleVO ?
                  <span className="price-by-coupon-count">
                    优惠:{serviceProps.integralsInfo.isChecked ?
                      Number(helper.countIntegralsToCash(
                        getDishesPrice(orderedDishesProps.dishes),
                        orderSummary.coupon,
                        serviceProps.integralsInfo.integralsDetail
                      ).commutation
                    ) + Number(helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes)))
                      + Number(orderSummary.coupon)
                    :
                    Number(helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes)))
                    + Number(orderSummary.coupon)
                  }
                  </span>
                  :
                  false
                }
                <span className="final-price">
                  实付:{Number(getDishesPrice(orderedDishesProps.dishes)) -
                    (serviceProps.integralsInfo.isChecked && commercialProps.carryRuleVO ?
                      Number(helper.countIntegralsToCash(
                        getDishesPrice(orderedDishesProps.dishes),
                        orderSummary.coupon,
                        serviceProps.integralsInfo.integralsDetail
                      ).commutation
                    ) + Number(helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes)))
                      + Number(orderSummary.coupon)
                    :
                    Number(helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes)))
                    + Number(orderSummary.coupon))
                  }
                </span>
              </p>
            </div>
            :
            false
          }
        </div>
        {childView === 'customer-info' ?
          <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setOrderProps} />
          : false}
        {childView === 'coupon-select' ?
          <CouponSelect couponsProps={serviceProps.couponsProps} onSelectCoupon={setOrderProps} />
          : false}
        {childView === 'table-select' ?
          <TableSelect areas={tableProps.areas} tables={tableProps.tables} onTableSelect={tableProp => console.log(tableProp)} />
          : false}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
