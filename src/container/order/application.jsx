const React = require('react');
const _find = require('lodash.find');
const classnames = require('classnames');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
const helper = require('../../helper/order-helper');
const validateAddressInfo = require('../../helper/order-helper').validateAddressInfo;
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const dateUtility = require('../../helper/common-helper.js').dateUtility;

const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const OrderPropOption = require('../../component/order/order-prop-option.jsx');
const GetDishMethod = require('../../component/order/get-dish-method.jsx');
const CustomerTakeawayInfoEditor = require('../../component/order/customer-takeaway-info-editor.jsx');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const CustomerToShopInfoEditor = require('../../component/order/customer-toshop-info-editor.jsx');
const CouponSelect = require('../../component/order/coupon-select.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const TimeSelect = require('../../component/order/select/time-select.jsx');
const OrderSummary = require('../../component/order/order-summary.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const Toast = require('../../component/mui/toast.jsx');
const VerificationDialog = require('../../component/common/verification-code-dialog.jsx');
const BenefitSelect = require('../../component/order/benefit-select.jsx');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const Loading = require('../../component/mui/loading.jsx');
const addressLogo = require('../../asset/images/addressLogo.svg');
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
    fetchUserAddressListInfo: React.PropTypes.func.isRequired,
    fetchSendAreaId:React.PropTypes.func.isRequired,
    fetchDeliveryPrice:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    setSessionAndForwardEditUserAddress:React.PropTypes.func.isRequired,
    setCustomerProps:React.PropTypes.func.isRequired,
    setCustomerToShopAddress:React.PropTypes.func,
    confirmOrderAddressInfo:React.PropTypes.func,
    setErrorMsg:React.PropTypes.func,
    setPhoneValidateProps:React.PropTypes.func.isRequired,
    checkCodeAvaliable:React.PropTypes.func.isRequired,
    fetchVericationCode:React.PropTypes.func.isRequired,
    fetchActivityBenefit:React.PropTypes.func.isRequired,
    onSelectBenefit:React.PropTypes.func.isRequired,
    setActivityBenefit:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    customerAddressListInfo:React.PropTypes.object,
    defaultCustomerProps:React.PropTypes.object,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    tableProps: React.PropTypes.object.isRequired,
    shuoldPhoneValidateShow:React.PropTypes.bool.isRequired,
    timeProps: React.PropTypes.object,
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    isBenefitSelectWindowShow:React.PropTypes.bool.isRequired,
    loadInfo: React.PropTypes.object,
  },
  getInitialState() {
    return {
      note:'',
      receipt:'',
      isSubmitBtnDisabled:false,
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
    this.setChildViewAccordingToHash();
    const { fetchOrder, fetchOrderDiscountInfo, fetchOrderCoupons, fetchActivityBenefit } = this.props;
    fetchOrder().then(
      fetchOrderDiscountInfo
    )
    .then(fetchOrderCoupons)
    .then(
      () => { this.setChildViewAccordingToHash(); }
    )
    .then(fetchActivityBenefit);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      isSubmitBtnDisabled:false,
    });
  },
  componentDidUpdate() {

  },
  onAddressEditor(editor, option) {
    const { setSessionAndForwardEditUserAddress } = this.props;
    if (option && option.id === 0) {
      location.hash = 'customer-info-toshop';
    } else {
      setSessionAndForwardEditUserAddress(editor);
    }
  },
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
    this.setDocumentTitleByHash(hash);
  },
  setDocumentTitleByHash(hash) {
    const type = getUrlParam('type');
    if (type !== 'WM') {
      return;
    }

    const title = {
      '#customer-info': '选择收货地址',
      '#customer-info-toshop': '编辑地址',
    }[hash] || '确定下单-外卖';
    document.title = title;
  },
  setOrderProps(newCount) {
    const { setOrderProps } = this.props;
    setOrderProps(null, Object.assign({}, { newCount }, { id:'customer-count' }));
  },
  confirmOrderAddressInfo(evt, info) {
    if (evt) {
      evt.preventDefault();
    }
    const { confirmOrderAddressInfo, setErrorMsg } = this.props;
    const currentAddress = info.addresses && info.addresses[0];
    if (!currentAddress) {
      return;
    }

    currentAddress.baseAddress = currentAddress.address;
    const validateResult = validateAddressInfo(currentAddress, currentAddress.id !== 0, key => key === 'street');

    if (!validateResult.valid) {
      // 到店取餐
      if (currentAddress.id === 0) {
        setErrorMsg('您选择的取餐信息不完全，请填写');
        setTimeout(() => {
          this.onAddressEditor(null, currentAddress);
        }, 3000);
        return;
      }

      // 无收货地址
      let msg = '';
      if (!currentAddress.address) {
        msg = '所选的配送地址无收货地址，请选择';
      } else {
        msg = '所选的配送地址信息不完全，请填写';
      }
      setErrorMsg(msg);
      setTimeout(() => {
        this.onAddressEditor(currentAddress.id.toString());
      }, 3000);
      return;
    }

    location.hash = '';
    confirmOrderAddressInfo(info);
  },
  resetChildView(evt, hash) {
    evt.preventDefault();
    const { setChildView } = this.props;
    if (location.hash !== '') {
      location.hash = hash || '';
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
  checkAddressChildViewAvailable(isPickupFromFrontDesk, tableProps) {
    if (isPickupFromFrontDesk && isPickupFromFrontDesk.isChecked) {
      return false;
    }
    const { setChildView } = this.props;
    if (!tableProps.isEditable) {
      return false;
    }
    return setChildView('#table-select');
  },
  buildSelectedTableElement(serviceProps, tableProps) {
    if (serviceProps.serviceApproach && serviceProps.serviceApproach.indexOf('totable') < 0) {
      return false;
    }
    const selectedTable = helper.getSelectedTable(tableProps);
    if (
      tableProps.areas && tableProps.areas.length &&
      tableProps.tables && tableProps.tables.length) {
      return (
        <a
          className={classnames('option', { tableHide:serviceProps.isPickupFromFrontDesk && serviceProps.isPickupFromFrontDesk.isChecked })}
          onTouchTap={evt => this.checkAddressChildViewAvailable(serviceProps.isPickupFromFrontDesk, tableProps)}
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
    return tableProps.isEditable ?
      <div className="option">
        <span className="options-title text-froly">该桌台已被占用</span>
      </div>
      :
      <div className="option">
        <span className="options-title text-froly">没有可用桌台</span>
      </div>;
  },
  buildTSCustomerPropsElement() {
    const { customerProps } = this.props;
    const { setErrorMsg } = this.props;
    if (customerProps.loginType === 0) {
      // 表示手机号登陆
      return (
        <div>
          <div className="customerInfo">
            <div className="editor options-group">
              <a className="option option-user">
                <img className="option-user-icon" src={customerProps.iconUri} alt="用户头像" />
                <p className="option-user-name">{customerProps.mobile}</p>
              </a>
            </div>
          </div>
          <div className="options-group editor-group">
            <div className="option">
              <span className="option-tile">就餐人数：</span>
              <ImportableCounter
                setErrorMsg={setErrorMsg}
                onCountChange={this.setOrderProps}
                count={customerProps.customerCount}
                maximum={99}
                minimum={1}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="weixin-login editor">
          <a className="option option-user">
            <img className="option-user-icon" src={customerProps.iconUri} alt="用户头像" />
            <p className="option-user-name">{customerProps.name}</p>
          </a>
        </div>
        <div className="options-group editor-group">
          <div className="option">
            <span className="option-tile">就餐人数：</span>
            <ImportableCounter
              setErrorMsg={setErrorMsg}
              onCountChange={this.setOrderProps}
              count={customerProps.customerCount}
              maximum={99}
              minimum={1}
            />
          </div>
        </div>
      </div>
    );
  },
  // 校验验证码
  handleConfirm(inputInfo) {
    const { setErrorMsg, checkCodeAvaliable } = this.props;
    const { data, validation } = inputInfo;
    if (!validation.valid) {
      setErrorMsg(validation.msg);
      return false;
    }
    // 新加内容，校验验证码是否正确
    checkCodeAvaliable(data, this.state.note, this.state.receipt);
    return false;
  },
  handleCodeClose() {
    const { setPhoneValidateProps } = this.props;
    setPhoneValidateProps(false);
  },
  buildPhoneValidateElement() {
    const { customerProps, fetchVericationCode } = this.props;
    const selectedAddressInfo = customerProps.addresses.filter(address => address.isChecked);
    // selectedAddressInfo一定是有长度的
    const placeholder = { phoneNum:selectedAddressInfo[0].mobile, code:'' };
    return (
      <div className="phone-validate-WM">
        <VerificationDialog
          phoneNum={placeholder.phoneNum ? placeholder.phoneNum.toString() : ''}
          phoneNumDisabled={!!placeholder.phoneNum}
          fetchCodeBtnText={'验证码'}
          onClose={this.handleCodeClose}
          onConfirm={this.handleConfirm}
          onGetVerificationCode={fetchVericationCode}
        />
      </div>
    );
  },
  submitOrder() {
    const { submitOrder } = this.props;
    const { isSubmitBtnDisabled } = this.state;
    if (!isSubmitBtnDisabled) {
      // 表示可用状态
      this.setState({
        isSubmitBtnDisabled:!isSubmitBtnDisabled,
      });
      submitOrder(this.state.note, this.state.receipt);
    }
    return false;
  },
  render() {
    const {
      customerProps, serviceProps, childView, tableProps, clearErrorMsg, setCustomerProps,
      timeProps, orderedDishesProps, commercialProps, errorMessage,
      customerAddressListInfo,
      defaultCustomerProps,
      setCustomerToShopAddress,
      shuoldPhoneValidateShow,
      isBenefitSelectWindowShow,
      setActivityBenefit,
      loadInfo,
    } = this.props; // state
    const { setOrderProps, fetchUserAddressListInfo, setChildView } = this.props;// actions
    const type = getUrlParam('type');
    const shopId = getUrlParam('shopId');
    const isSelfFetch = !!_find(customerProps.addresses, { isChecked: true, id: 0 });

    const buildCustomerPropElement = () => {
      const elems = [];
      const originMa = customerProps.originMa || {};
      let addressText = '';
      let checkedAddressInfo = null;
      if (originMa.id === 0) {
        checkedAddressInfo = originMa;
      } else if (customerProps.addresses && customerProps.addresses.length) {
        checkedAddressInfo = _find(customerProps.addresses, { isChecked: true });
      }

      if (checkedAddressInfo) {
        elems.push(
          <div className="option-stripes-title" key="title">
            {checkedAddressInfo.name}{['女士', '先生'][checkedAddressInfo.sex] || ''}
            {checkedAddressInfo.mobile}
          </div>
        );
        addressText = checkedAddressInfo.address;
        elems.push(
          <div className="clearfix" key="address">
            <div className="option-desc">
              {addressText || (isSelfFetch ? '到店取餐' : '选择收货地址')}
            </div>
          </div>
        );
      } else {
        elems.push(
          <div className="option-stripes-title" key="title">
            {'选择收货地址'}
          </div>
        );
        elems.push(
          <div className="clearfix" key="address">
            <div className="option-desc">
              {'您还没有添加地址唷～'}
            </div>
          </div>
        );
      }

      const hash = `#customer-info${originMa.id === 0 ? '-toshop' : ''}`;
      return (
        <a className="options-group options-group--stripes" href={hash} >
          <img src={addressLogo} alt="address-logo" className="address-logo" />
          {elems}
        </a>
      );
    };

    const getFetchTimeTitle = () => {
      const selectedDateTime = timeProps.selectedDateTime || {};
      const postfix = isSelfFetch ? '取餐' : '送达';
      const todayStr = dateUtility.format(new Date());
      const dateStr = selectedDateTime.date;
      const timeStr = selectedDateTime.time;
      if (!dateStr) {
        return `选择${postfix}时间`;
      }

      if (dateStr === todayStr) {
        return timeStr ? `今日 ${timeStr} ${postfix}` : `立即${postfix}`;
      }
      return `${dateStr} ${timeStr} ${postfix}`;
    };
    const buildSelectTimeElemnet = () => {
      if (getUrlParam('type') === 'TS') {
        return false;
      }

      if (getUrlParam('type') === 'WM' && !helper.isEmptyObject(timeProps.timeTable) && timeProps.timeTable !== undefined) {
        return (
          <div className="option">
            <span className="options-title">{isSelfFetch ? '取餐时间' : '送达时间'}</span>
            <button className="option-btn btn-arrow-right" onTouchTap={evt => setChildView('#time-select')}>
              {getFetchTimeTitle()}
            </button>
          </div>
        );
      }
      return (
        <div className="option">没有可用{isSelfFetch ? '取餐时间' : '送达时间'}</div>
      );
    };

    return (
      <div className="application flex-columns">
        <div className="flex-rest">
          {type === 'WM' ? buildCustomerPropElement() : this.buildTSCustomerPropsElement()}
          {getUrlParam('type') !== 'TS' ?
            <div className="options-group">
              {buildSelectTimeElemnet()}
            </div>
            :
            false
          }

          {type === 'WM' ?
            false
            :
            <div className="options-group">
              {serviceProps.serviceApproach ?
                <div style={{ position:'relative', borderBottom:'0.5px solid #e1e1e1' }}>
                  <GetDishMethod serviceProps={serviceProps} onSelectOption={setOrderProps} />
                </div>
                : false
              }
              {this.buildSelectedTableElement(serviceProps, tableProps)}
            </div>
          }
          <div className="options-group editor">
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

          <OrderSummary
            serviceProps={serviceProps} orderedDishesProps={orderedDishesProps}
            commercialProps={commercialProps} shopId={shopId} isNeedShopMaterial
            onSelectBenefit={this.props.onSelectBenefit} setOrderProps={setOrderProps}
          />

          <div className="options-group">
            <label className="option adjust-option">
              <span className="option-title">备注 </span>
              <input className="option-input" name="note" placeholder="请输入备注" maxLength="35" onChange={this.noteOrReceiptChange} />
            </label>
            {commercialProps && commercialProps.isSupportInvoice === 1 ?
              <label className="option adjust-option">
                <span className="option-title">发票 </span>
                <input className="option-input" name="receipt" placeholder="请输入个人或公司抬头" onChange={this.noteOrReceiptChange} />
              </label>
              :
              false
            }
          </div>
        </div>

        {orderedDishesProps.dishes && orderedDishesProps.dishes.length ?
          <div className="order-cart flex-none">
            <div className="order-cart-left">
              <div className="vertical-center clearfix">
                {commercialProps.carryRuleVO ?
                  <div>
                    <div className="order-cart-entry text-dove-grey">已优惠&nbsp;
                      <span className="price">
                        {helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)}
                      </span>
                    </div>
                    <div className="order-cart-entry" style={{ float:'right' }}>
                      <span className="text-dove-grey">还需付 </span>
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
              <a className="order-cart-btn btn--yellow" onTouchTap={this.submitOrder}>确认订单</a>
            </div>
          </div>
          :
          false
        }

        {isBenefitSelectWindowShow ?
          <Dialog
            title="该商品可参加以下优惠"
            theme="sliver"
            onClose={() => { this.props.onSelectBenefit(); }}
          >
            <BenefitSelect
              setActivityBenefit={setActivityBenefit}
              dish={serviceProps.activityBenefit.relatedDish}
              serviceProps={serviceProps}
              onSelectBenefit={this.props.onSelectBenefit}
            />
          </Dialog>
          :
          false
        }
        {childView === 'customer-info' && type === 'TS' ?
          <CustomerInfoEditor
            customerProps={customerProps} onCustomerPropsChange={setCustomerProps} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'customer-info-toshop' ?
          <CustomerToShopInfoEditor
            originMa={customerProps.originMa}
            customerAddressListInfo={customerAddressListInfo}
            onComponentWillMount={fetchUserAddressListInfo}
            onCustomerPropsChange={setCustomerToShopAddress} onDone={this.resetChildView}
          />
          : false
        }
        {childView === 'customer-info' && type === 'WM' ?
          <CustomerTakeawayInfoEditor
            customerProps={customerProps}
            customerAddressListInfo={customerAddressListInfo}
            defaultCustomerProps={defaultCustomerProps}
            sendAreaId={serviceProps.sendAreaId}
            onAddressEditor={this.onAddressEditor}
            onCustomerAddressPropsChange={this.confirmOrderAddressInfo}
            onComponentWillMount={fetchUserAddressListInfo}
            onDone={this.resetChildView}
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
        {shuoldPhoneValidateShow ?
          this.buildPhoneValidateElement()
          :
          false
        }
        {loadInfo && loadInfo.ing && <Loading word={loadInfo.word} />}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
