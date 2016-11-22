const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/place-order/place-order');
const getSelectedTable = require('../../helper/order-helper.js').getSelectedTable;
const CustomerInfoEditor = require('../../component/order/list-customer-info-editor.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const TimeSelect = require('../../component/order/select/time-select.jsx');
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');
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
    onDateTimeSelect:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    dinePersonCount:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    tableProps:React.PropTypes.object.isRequired,
    timeProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    childView: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    shuoldPhoneValidateShow:React.PropTypes.bool.isRequired,
    load:React.PropTypes.object,
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
    const selectedDateTime = timeProps.selectedDateTime;
    if (!selectedDateTime) {
      return null;
    }
    const dateStr = selectedDateTime.date.replace(/-/g, '/');
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
          className="option" style={{ position:'relative' }}
          onTouchTap={evt => setChildView('#table-select')}
        >
          <span className="options-title">桌台类型</span>
          <span className="option-btn btn-arrow-right ellipsis">
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
    const { commercialProps, childView, tableProps, timeProps, setTableProps, setErrorMsg, clearErrorMsg, setCustomerProps, load } = this.props;
    // mapActionsToProps
    const { setChildView, onDateTimeSelect, errorMessage, dinePersonCount, customerProps, shuoldPhoneValidateShow } = this.props;
    return (
      <div className="application">
        <div className="content">
          <div className="content-shop">
            <img className="content-shop-icon" src={commercialProps.shopLogo || defaultShopLogo} alt="" />
            <p className="content-shop-desc ellipsis">{commercialProps.shopName}</p>
          </div>
          <div className="divider">
            <span className="divider-title">预订信息</span>
          </div>

          <div>
            {commercialProps.hasPeriodConfiguer && commercialProps.firstTime ?
              <div className="options-group place-order-options">
                <div className="option">
                  <span className="options-title">预订时间</span>
                  <button className="option-btn btn-arrow-right ellipsis" onTouchTap={evt => setChildView('#time-select')}>
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
                <span className="option-tile for-count">预订人数：</span>
                <ImportableCounter
                  setErrorMsg={setErrorMsg}
                  onCountChange={this.setOrderProps}
                  count={dinePersonCount}
                  maximum={99}
                  minimum={1}
                />
              </div>
            </div>
            <div className="divider" style={{ marginTop:'0px' }}>
              <span className="divider-title">联系方式</span>
            </div>

            <CustomerInfoEditor
              customerProps={customerProps}
              onCustomerPropsChange={setCustomerProps}
              isMobileDisabled={customerProps.mobile === null}
            />
            <div className="divider" style={{ marginTop:'0px', paddingBottom:'30px' }}>
              <span className="divider-title">备注</span>
            </div>
            <div className="option-groups">
              <div className="option" style={{ paddingTop:'10px' }}>
                <textarea className="option-input clearfix text-area" name="note" placeholder="请输入备注" maxLength="500" onChange={this.noteChange} />
              </div>
            </div>
            <div className="option-groups">
              <div className="option">
                <button className="place-order" onTouchTap={this.placeOrder}>立即预订</button>
              </div>
            </div>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
          {childView === 'table-select' ?
            <TableSelect
              areas={tableProps.areas} tables={tableProps.tables}
              onTableSelect={setTableProps} onDone={this.resetChildView}
              title={'选择桌台类型'}
            />
            : false
          }

          {childView === 'time-select' ?
            <TimeSelect
              isSelfFetch={false}
              selectedDateTime={timeProps.selectedDateTime} timeTable={timeProps.timeTable}
              onDateTimeSelect={onDateTimeSelect} onDone={this.resetChildView}
              title={'预订'}
            />
            : false
          }
        </ReactCSSTransitionGroup>
        {
          load.status ?
            <Loading word={load.word} />
          :
            false
        }
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
