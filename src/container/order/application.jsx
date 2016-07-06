const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
const helper = require('../../helper/order-helper');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
// const TableSelect = require('../../component/order/select/table-select.jsx');
const OrderedDish = require('../../component/order/ordered-dish.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getDishesCount = require('../../helper/dish-hepler.js').getDishesCount;
const TimeSelect = require('../../component/order/select/time-select.jsx');
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
    setOrderPropsAndResetChildView: React.PropTypes.func.isRequired,
    getLastOrderedDishes:React.PropTypes.func.isRequired,
    submitOrderProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    orderSummary:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object.isRequired,
    timeProps: React.PropTypes.object,
    childView: React.PropTypes.string,
  },
  getInitialState() {
    return {
      note:'',
      receipt:'',
    };
  },
  componentWillMount() {
    const { getLastOrderedDishes } = this.props;
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    getLastOrderedDishes();
  },
  componentDidMount() {
    const { fetchOrder, fetchOrderDiscountInfo, fetchOrderCoupons } = this.props;
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
  resetChildView() {
    location.hash = '';
  },
  noteOrReceiptChange(evt) {
    const name = evt.target.getAttribute('name');
    const value = evt.target.value;
    if (name === 'note') {
      this.setState({
        note:value,
      });
    } else {
      this.setState({
        receipt:value,
      });
    }
  },
  submitOrderProps() {
    const { submitOrderProps } = this.props;
    submitOrderProps(this.state.note, this.state.receipt);
  },
  render() {
    const {
      customerProps, serviceProps, childView, tableProps,
      timeProps, orderedDishesProps, commercialProps, orderSummary,
    } = this.props; // states
    const { setOrderProps } = this.props;// actions
    const selectedTable = helper.getSelectedTable(tableProps);
    const type = getUrlParam('type');
    return (
      <div className="application">
        <a className="options-group options-group--stripes" href="#customer-info" >
          <div className="option-stripes-title">{customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'}</div>
          <div className="clearfix">
            <div className="option-desc half">{customerProps.mobile}</div>
            <div className="option-desc half"><span className="text-picton-blue">{customerProps.customerCount}</span>人就餐</div>
          </div>
        </a>
        {type === 'WM' ?
          false
          :
          <div className="options-group">
            {serviceProps.isPickupFromFrontDesk ?
              <ActiveSelect
                optionsData={[serviceProps.isPickupFromFrontDesk]} onSelectOption={setOrderProps}
                optionComponent={OrderPropOption}
              />
              : false
            }
            {!serviceProps.isPickupFromFrontDesk.isChecked &&
              tableProps.areas && tableProps.areas.length &&
              tableProps.tables && tableProps.tables.length ?
              <a className="order-prop-option" href="#table-select" >
                <span className="options-title">选择桌台</span>
                <span className="option-btn btn-arrow-right">
                  {selectedTable.area && selectedTable.table ?
                    `${selectedTable.area.areaName} ${selectedTable.table.tableName}`
                    :
                    false
                  }
                </span>
              </a>
              :
              false
            }
          </div>
        }
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
          {serviceProps.couponsProps.couponsList &&
            serviceProps.couponsProps.couponsList.length &&
            !serviceProps.discountProps.discountInfo.isChecked ?
            <a className="order-prop-option" href="#coupon-select">
              <span className="option-title">使用优惠券</span>
              <span className="badge-coupon">
                {serviceProps.couponsProps.inUseCoupon ?
                  '已使用一张优惠券'
                  :
                  `${serviceProps.couponsProps.couponsList.length}张可用`
                }
              </span>
              <span className="option-btn btn-arrow-right">{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</span>
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
          {type === 'WM' && timeProps.timeTable !== {} && timeProps.timeTable !== undefined ?
            <a className="order-prop-option" href="#time-select" >
              <span className="options-title">送达时间</span>
              <button className="option-btn btn-arrow-right">
                {`${timeProps.selectedDateTime.date} ${timeProps.selectedDateTime.time} 送达`}
              </button>
            </a>
            :
            false
          }
          <label className="order-prop-option">
            <span className="option-title">备注: </span>
            <input className="option-input" name="note" placeholder="输入备注" onChange={this.noteOrReceiptChange} />
          </label>
          <label className="order-prop-option">
            <span className="option-title">发票抬头: </span>
            <input className="option-input" name="receipt" placeholder="输入个人或公司抬头" onChange={this.noteOrReceiptChange} />
          </label>
        </div>
        <div className="options-group">
          <a className="order-prop-option order-shop" href={'/shop/detail?shopId=' + getUrlParam('shopId')}>
            <img className="order-shop-icon" src={commercialProps.commercialLogo} alt="" />
            <p className="order-shop-desc ellipsis">{commercialProps.name}</p>
          </a>
          {orderedDishesProps.dishes && orderedDishesProps.dishes.length ?
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
                {serviceProps.integralsInfo.isChecked ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">积分抵扣:</span>
                    <span className="order-discount discount">
                    {helper.countIntegralsToCash(
                      getDishesPrice(orderedDishesProps.dishes),
                      orderSummary.coupon,
                      serviceProps.integralsInfo.integralsDetail
                    ).commutation}
                    </span>
                    <span className="order-integral">
                      {helper.countIntegralsToCash(
                        getDishesPrice(orderedDishesProps.dishes),
                        orderSummary.coupon,
                        serviceProps.integralsInfo.integralsDetail
                      ).integralInUsed}
                    </span>
                  </p>
                  :
                  false
                }
                {commercialProps.carryRuleVO ?
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
              <div className="order-prop-option order-total clearfix">
                <div className="order-total-left">
                  <span className="text-dove-grey">总计: </span>
                  <span className="price">{getDishesPrice(orderedDishesProps.dishes)}</span>
                </div>
                <div className="order-total-left">
                  <span className="text-dove-grey">优惠: </span>
                  <span className="price">
                    {helper.countDecreasePrice(orderedDishesProps, orderSummary, serviceProps.integralsInfo, commercialProps)}
                  </span>
                </div>
                <div className="order-total-right">
                  <span className="text-dove-grey">实付: </span>
                  <span className="price">
                    {helper.countFinalPrice(orderedDishesProps, orderSummary, serviceProps.integralsInfo, commercialProps)}
                  </span>
                </div>
              </div>
              <div className="options-group">
                <a className="order-prop-option" href={'/dish-menu.html?type=' + getUrlParam('type') + '&shopId=' + getUrlParam('shopId')}>
                  <span className="order-add-text">我要加菜</span>
                  <span className="option-btn btn-arrow-right">共{getDishesCount(orderedDishesProps.dishes)}份</span>
                </a>
              </div>

              <div className="order-cart">
                <div className="order-cart-left">
                  <div className="vertical-center clearfix">
                    <div className="order-cart-entry text-dove-grey">已优惠:
                      <span className="price">
                        {helper.countDecreasePrice(orderedDishesProps, orderSummary, serviceProps.integralsInfo, commercialProps)}
                      </span>
                    </div>
                    <div className="order-cart-entry">
                      <span className="text-dove-grey">待支付: </span>
                      <span className="order-cart-price price">
                       {helper.countFinalPrice(orderedDishesProps, orderSummary, serviceProps.integralsInfo, commercialProps)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="order-cart-right">
                  <a className="order-cart-btn btn--yellow" onTouchTap={this.submitOrderProps}>提交订单</a>
                </div>
              </div>
            </div>
            :
            false
          }
        </div>

        {childView === 'customer-info' ?
          <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setOrderProps} />
          : false
        }
        {childView === 'coupon-select' ?
          <CouponSelect couponsProps={serviceProps.couponsProps} onSelectCoupon={setOrderProps} />
          : false
        }
        {childView === 'table-select' ?
          <TableSelect
            areas={tableProps.areas} tables={tableProps.tables}
            onTableSelect={setOrderProps} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'time-select' ?
          <TimeSelect
            selectedDateTime={timeProps.selectedDateTime} timeTable={timeProps.timeTable}
            onDateTimeSelect={setOrderProps} onDone={this.resetChildView}
          />
          : false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
