const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/place-order/place-order');
const config = require('../../config.js');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getSelectedTable = require('../../helper/order-helper.js').getSelectedTable;
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const TimeSelect = require('../../component/order/select/time-select.jsx');
const Toast = require('../../component/mui/toast.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const VerificationDialog = require('../../component/common/verification-code-dialog.jsx');
const defaultShopLogo = require('../../asset/images/default.png');
require('../../asset/style/style.scss');
require('./application.scss');
require('../../component/order/order-summary.scss'); // import option-shop styles

const PlaceOrderApplication = React.createClass({
  displayName:'PlaceOrderApplication',
  propTypes:{
    // MapedActionsToProps
    fetchCommercialProps:React.PropTypes.func.isRequired,
    fetchTables:React.PropTypes.func.isRequired,
    setChildView:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    placeOrder:React.PropTypes.func.isRequired,
    setTableProps:React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    setCustomerProps:React.PropTypes.func.isRequired,
    setPhoneValidateProps:React.PropTypes.func.isRequired,
    fetchVericationCode:React.PropTypes.func.isRequired,
    checkCodeAvaliable:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    dinePersonCount:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    tableProps:React.PropTypes.object.isRequired,
    timeProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    shuoldPhoneValidateShow:React.PropTypes.bool.isRequired,
  },
  getInitialState() {
    return {
      note:'',
    };
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    this.setChildViewAccordingToHash();
    const { fetchCommercialProps, fetchTables } = this.props;
    fetchCommercialProps()
      .then(fetchTables)
      .then(
        () => { this.setChildViewAccordingToHash(); }
      );
  },
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },
  getFetchTimeTitle(timeProps) {
    const selectedDateTime = timeProps.selectedDateTime || {};
    const dateStr = selectedDateTime.date;
    const timeStr = selectedDateTime.time;
    return `${dateStr} ${timeStr}`;
  },
  setOrderProps(newCount, increment) {
    const { setOrderProps } = this.props;
    const countProps = { id:'dine-person-count', newCount };
    setOrderProps(null, countProps);
  },
  noteChange(evt) {
    const value = evt.target.value;
    this.setState({
      note:value,
    });
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
  placeOrder() {
    const { placeOrder } = this.props;
    const { note } = this.state;
    placeOrder(note);
  },
  buildSelectTablesElement(tableProps) {
    const { setChildView } = this.props;
    if (tableProps.areas && tableProps.areas.length && tableProps.tables && tableProps.tables.length) {
      const selectedTable = getSelectedTable(tableProps);
      return (
        <a
          className="option"
          onTouchTap={evt => setChildView('#table-select')}
        >
          <span className="options-title">桌台类型</span>
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
      <a className="option">
        <span className="options-title">桌台类型</span>
        <span className="option-btn">
          没有桌台信息
        </span>
      </a>
    );
  },
  // 校验验证码
  handleConfirm(inputInfo) {
    const { setErrorMsg, checkCodeAvaliable } = this.props;
    const { note } = this.state;
    const { data, validation } = inputInfo;
    if (!validation.valid) {
      setErrorMsg(validation.msg);
      return false;
    }
    // 新加内容，校验验证码是否正确
    checkCodeAvaliable(data, note);
    return false;
  },
  handleCodeClose() {
    const { setPhoneValidateProps } = this.props;
    setPhoneValidateProps(false);
  },
  buildPhoneValidateElement() {
    const { customerProps, fetchVericationCode } = this.props;
    const placeholder = { phoneNum:customerProps.mobile, code:'' };
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
  render() {
    // mapStateToProps
    const { commercialProps, childView, tableProps, timeProps, setTableProps, setErrorMsg, clearErrorMsg, setCustomerProps } = this.props;
    // mapActionsToProps
    const { setChildView, setOrderProps, errorMessage, dinePersonCount, customerProps, shuoldPhoneValidateShow } = this.props;
    return (
      <div className="application">
        <div className="options-group">
          <a className="option option-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
            <img className="option-shop-icon" src={commercialProps.shopLogo || defaultShopLogo} alt="" />
            <p className="option-shop-desc ellipsis">{commercialProps.shopName}</p>
          </a>
        </div>

        <div>
          {commercialProps.hasPeriodConfiguer && commercialProps.firstTime ?
            <div className="options-group place-order-options">
              <div className="option">
                <span className="options-title">预订时间</span>
                <button className="option-btn btn-arrow-right" onTouchTap={evt => setChildView('#time-select')}>
                  {this.getFetchTimeTitle(timeProps) || '选择预订时间'}
                </button>
              </div>

              {this.buildSelectTablesElement(tableProps)}
            </div>
            :
            <div className="options-group">
              <div className="option">
                <span className="options-title">预订时间</span>
                <button className="option-btn">
                  已无可选时段
                </button>
              </div>

              <a className="option">
                <span className="options-title">桌台类型</span>
                <span className="option-btn">
                  无可预订桌台
                </span>
              </a>
            </div>
          }

          <div className="options-group">
            <div className="option">
              <span className="option-tile">就餐人数：</span>
              <ImportableCounter
                setErrorMsg={setErrorMsg}
                onCountChange={this.setOrderProps}
                count={dinePersonCount}
                maximum={99}
                minimum={1}
              />
            </div>
          </div>

          <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setCustomerProps} isMobileDisabled />

          <div className="options-group">
            <label className="option">
              <span className="option-title">备注: </span>
              <input className="option-input" name="note" placeholder="输入备注" maxLength="500" onChange={this.noteChange} />
            </label>
          </div>
          <button className="place-order" onTouchTap={this.placeOrder}>立即预订</button>
        </div>
        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {childView === 'table-select' ?
            <TableSelect
              areas={tableProps.areas} tables={tableProps.tables}
              onTableSelect={setTableProps} onDone={this.resetChildView}
            />
            : false
          }

          {childView === 'time-select' ?
            <TimeSelect
              isSelfFetch={false}
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
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(PlaceOrderApplication);