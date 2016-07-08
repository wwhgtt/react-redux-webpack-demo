const React = require('react');
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
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
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
    submitOrder:React.PropTypes.func.isRequired,
    fetchUserAddressInfo: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object.isRequired,
    timeProps: React.PropTypes.object,
    childView: React.PropTypes.string,
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
    const { setChildView } = this.props;
    if (location.hash !== '') {
      location.hash = '';
    } else {
      setChildView('');
    }
  },
  render() {
    const {
      customerProps, serviceProps, childView, tableProps,
      timeProps, orderedDishesProps, commercialProps, submitOrder,
    } = this.props; // state
    const { setOrderProps, fetchUserAddressInfo, setChildView } = this.props;// actions
    const selectedTable = helper.getSelectedTable(tableProps);
    const type = getUrlParam('type');
    const shopId = getUrlParam('shopId');
    return (
      <div className="application">
        {type === 'WM' ?
          <a className="options-group options-group--stripes" href="#customer-info" >
            <div className="option-stripes-title">{customerProps.name}{customerProps.sex === '1' ? '先生' : '女士'} {customerProps.mobile}</div>
            <div className="clearfix">
              <div className="option-desc half">天府软件园E区</div>
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
            {!serviceProps.isPickupFromFrontDesk.isChecked &&
              tableProps.areas && tableProps.areas.length &&
              tableProps.tables && tableProps.tables.length ?
              <a className="order-prop-option" onTouchTap={evt => setChildView('#table-select')} >
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
            <a className="order-prop-option" onTouchTap={evt => setChildView('#time-select')} >
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
        <OrderSummary
          serviceProps={serviceProps} orderedDishesProps={orderedDishesProps}
          commercialProps={commercialProps} shopId={shopId} submitOrder={submitOrder}
          type={type}
        />

        {childView === 'customer-info' && type === 'TS' ?
          <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setOrderProps} onDone={this.resetChildView} />
          : false
        }
        {childView === 'customer-info' && type === 'WM' ?
          <CustomerTakeawayInfoEditor
            customerProps={customerProps}
            onCustomerPropsChange={setOrderProps} onComponentWillMount={fetchUserAddressInfo} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'coupon-select' ?
          <CouponSelect couponsProps={serviceProps.couponsProps} onSelectCoupon={setOrderProps} />
          : false
        }

        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={300}>
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
        </ReactCSSTransitionGroup>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
