const React = require('react');
const _find = require('lodash.find');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
const helper = require('../../helper/order-helper');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const CustomerTakeawayInfoEditor = require('../../component/order/customer-takeaway-info-editor.jsx');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const TimeSelect = require('../../component/order/select/time-select.jsx');
const OrderSummary = require('../../component/order/order-summary.jsx');
const Toast = require('../../component/mui/toast.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getDishesCount = require('../../helper/dish-hepler.js').getDishesCount;
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
    fetchLastOrderedDishes:React.PropTypes.func.isRequired,
    submitOrder:React.PropTypes.func.isRequired,
    fetchUserAddressInfo: React.PropTypes.func.isRequired,
    fetchSendAreaId:React.PropTypes.func.isRequired,
    fetchDeliveryPrice:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    setSessionAndForwardChaining:React.PropTypes.func.isRequired,
    setCustomerProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object.isRequired,
    timeProps: React.PropTypes.object,
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
  },
  getInitialState() {
    return {
      note:'',
      receipt:'',
    };
  },
  componentWillMount() {
    const { fetchLastOrderedDishes, fetchSendAreaId, fetchDeliveryPrice } = this.props;
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
    fetchLastOrderedDishes();
    if (getUrlParam('type') === 'WM') {
      fetchSendAreaId();
      fetchDeliveryPrice();
    }
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
  resetChildView(evt) {
    evt.preventDefault();
    const { setChildView } = this.props;
    if (location.hash !== '') {
      location.hash = '';
    } else {
      setChildView('');
    }
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
  checkAddressChildViewAvailable(tableProps) {
    const { setChildView } = this.props;
    if (!tableProps.isEditable) {
      return false;
    }
    return setChildView('#table-select');
  },
  buildSelectedTableElement(isPickupFromFrontDesk, tableProps) {
    const selectedTable = helper.getSelectedTable(tableProps);
    if (isPickupFromFrontDesk && isPickupFromFrontDesk.isChecked) {
      return false;
    } else if (
      tableProps.areas && tableProps.areas.length &&
      tableProps.tables && tableProps.tables.length) {
      return (
        <a
          className="order-prop-option"
          onTouchTap={evt => this.checkAddressChildViewAvailable(tableProps)}
        >
          <span className="options-title">选择桌台</span>
          <span className="option-btn btn-arrow-right">
            {selectedTable.area && selectedTable.table ?
              `${selectedTable.area.areaName} ${selectedTable.table.tableName}`
              :
              false
            }
          </span>
        </a>
      );
    }
    return (
      <div className="order-prop-option">
        <span className="options-title text-froly">该桌台已被占用</span>
      </div>
    );
  },
  submitOrder() {
    const { submitOrder } = this.props;
    submitOrder(this.state.note, this.state.receipt);
  },
  render() {
    const {
      customerProps, serviceProps, childView, tableProps, clearErrorMsg, setCustomerProps,
      timeProps, orderedDishesProps, commercialProps, errorMessage, setSessionAndForwardChaining,
    } = this.props; // state
    const { setOrderProps, fetchUserAddressInfo, setChildView } = this.props;// actions
    const type = getUrlParam('type');
    const shopId = getUrlParam('shopId');
    const getDefaultAddressProps = function () {
      if (serviceProps.sendAreaId !== 0) {
        // 表示需要选择地址
        if (customerProps.addresses && customerProps.addresses.length) {
          const isCheckedAddressInfo = _find(customerProps.addresses, { isChecked:true });
          return isCheckedAddressInfo ? isCheckedAddressInfo.address : '请选择送餐地址';
        }
        return '请选择送餐地址';
      }
      return '到店取餐';
    };
    const buildCoustomerPropElement = function () {
      if (serviceProps.sendAreaId !== 0) {
        if (customerProps.addresses && customerProps.addresses.length) {
          const isCheckedAddressInfo = _find(customerProps.addresses, { isChecked:true });
          return isCheckedAddressInfo ?
          (
            <div className="option-stripes-title">
              {customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'}
              {customerProps.mobile}
            </div>
          )
          :
          false;
        }
        return false;
      }
      return (
        <div className="option-stripes-title">
          {customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'}
          {customerProps.mobile}
        </div>
      );
    };
    const isSelfFetch = serviceProps.sendAreaId === 0;
    return (
      <div className="application">
        {type === 'WM' ?
          <a className="options-group options-group--stripes" href="#customer-info" >
            {buildCoustomerPropElement()}
            <div className="clearfix">
              <div className="option-desc">
                {getDefaultAddressProps()}
              </div>
            </div>
          </a>
          :
          <a className="options-group options-group--stripes" href="#customer-info" >
            <div className="option-stripes-title">{customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'}</div>
            <div className="clearfix">
              <div className="option-desc half">{customerProps.mobile}</div>
              <div className="option-desc half"><span className="text-picton-blue">{customerProps.customerCount}</span>人就餐</div>
            </div>
          </a>
        }
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
            {this.buildSelectedTableElement(serviceProps.isPickupFromFrontDesk, tableProps)}
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
          {serviceProps.discountProps.discountInfo && !serviceProps.couponsProps.inUseCoupon
            && orderedDishesProps.dishes && orderedDishesProps.dishes.length
            && orderedDishesProps.dishes.filter(dish => dish.isMember).length !== 0
            && commercialProps.diningForm !== 0 ?
            <ActiveSelect
              optionsData={[serviceProps.discountProps.discountInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false}
          {serviceProps.couponsProps.couponsList &&
            serviceProps.couponsProps.couponsList.length &&
            !serviceProps.discountProps.discountInfo.isChecked && commercialProps.diningForm !== 0 ?
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
          {serviceProps.integralsInfo && commercialProps.diningForm !== 0 ?
            <ActiveSelect
              optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption}
            />
          : false}
        </div>

        <div className="options-group">
          {type === 'WM' && timeProps.timeTable !== {} && timeProps.timeTable !== undefined ?
            <div className="order-prop-option">
              <span className="options-title">{isSelfFetch ? '取餐时间' : '送达时间'}</span>
              <button className="option-btn btn-arrow-right" onTouchTap={evt => setChildView('#time-select')}>
                {`${timeProps.selectedDateTime.date} ${timeProps.selectedDateTime.time || '立即'}`}
                {`${timeProps.selectedDateTime.time ? ' ' : ''}`}
                {isSelfFetch ? '取餐' : '送达'}
              </button>
            </div>
            :
            false
          }
          <label className="order-prop-option">
            <span className="option-title">备注: </span>
            <input className="option-input" name="note" placeholder="输入备注" maxLength="35" onChange={this.noteOrReceiptChange} />
          </label>
          {commercialProps && commercialProps.isSupportInvoice === 1 ?
            <label className="order-prop-option">
              <span className="option-title">发票抬头: </span>
              <input className="option-input" name="receipt" placeholder="输入个人或公司抬头" onChange={this.noteOrReceiptChange} />
            </label>
            :
            false
          }

        </div>

        <OrderSummary
          serviceProps={serviceProps} orderedDishesProps={orderedDishesProps}
          commercialProps={commercialProps} shopId={shopId}
        />

        {orderedDishesProps.dishes && orderedDishesProps.dishes.length ?
          <div>
            <div className="options-group">
              <a
                className="order-prop-option"
                href={helper.getMoreDishesUrl()}
              >
                <span className="order-add-text">我要加菜</span>
                <span className="option-btn btn-arrow-right">共{getDishesCount(orderedDishesProps.dishes)}份</span>
              </a>
            </div>

            <div className="order-cart">
              <div className="order-cart-left">
                <div className="vertical-center clearfix">
                  {commercialProps.carryRuleVO ?
                    <div>
                      <div className="order-cart-entry text-dove-grey">已优惠:&nbsp;
                        <span className="price">
                          {helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)}
                        </span>
                      </div>
                      <div className="order-cart-entry">
                        <span className="text-dove-grey">待支付: </span>
                        <span className="order-cart-price price">
                          {
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
                <a className="order-cart-btn btn--yellow" onTouchTap={this.submitOrder}>提交订单</a>
              </div>
            </div>
          </div>
          :
          false
        }

        {childView === 'customer-info' && type === 'TS' ?
          <CustomerInfoEditor
            customerProps={customerProps} onCustomerPropsChange={setCustomerProps} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'customer-info' && type === 'WM' ?
          <CustomerTakeawayInfoEditor
            customerProps={customerProps} sendAreaId={serviceProps.sendAreaId} onAddressEditor={setSessionAndForwardChaining}
            onCustomerPropsChange={setCustomerProps} onComponentWillMount={fetchUserAddressInfo} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'coupon-select' ?
          <CouponSelect couponsProps={serviceProps.couponsProps} onSelectCoupon={setOrderProps} />
          : false
        }
        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {childView === 'table-select' ?
            <TableSelect
              areas={tableProps.areas} tables={tableProps.tables}
              onTableSelect={setOrderProps} onDone={this.resetChildView}
            />
            : false
          }

          {childView === 'time-select' ?
            <TimeSelect
              isSelfFetch={isSelfFetch}
              selectedDateTime={timeProps.selectedDateTime} timeTable={timeProps.timeTable}
              onDateTimeSelect={setOrderProps} onDone={this.resetChildView}
            />
            : false
          }
        </ReactCSSTransitionGroup>
        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
