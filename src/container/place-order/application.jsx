const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/place-order/place-order');
const config = require('../../config.js');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const getSelectedTable = require('../../helper/order-helper.js').getSelectedTable;
// const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const TableSelect = require('../../component/order/select/table-select.jsx');
const TimeSelect = require('../../component/order/select/time-select.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

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
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    tableProps:React.PropTypes.object.isRequired,
    timeProps:React.PropTypes.object.isRequired,
    childView: React.PropTypes.string,
  },
  getInitialState() {
    return {

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
    // const { placeOrder, tableProps, timeProps } = this.props;

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
    return false;
  },
  render() {
    // mapStateToProps
    const { commercialProps, childView, tableProps, timeProps, setTableProps } = this.props;
    // mapActionsToProps
    const { setChildView, setOrderProps } = this.props;
    return (
      <div className="application">
        <a className="option order-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
          <img className="order-shop-icon" src={commercialProps.shopLogo} alt="" />
          <p className="order-shop-desc ellipsis">{commercialProps.shopName}</p>
        </a>

        <div className="option">
          <span className="options-title">预定时间</span>
          <button className="option-btn btn-arrow-right" onTouchTap={evt => setChildView('#time-select')}>
            选择预定时间
          </button>
        </div>

        {this.buildSelectTablesElement(tableProps)}

        <label className="option">
          <span className="option-title">备注: </span>
          <input className="option-input" name="note" placeholder="输入备注" maxLength="35" onChange={this.noteOrReceiptChange} />
        </label>
        <button className="place-order" onTouchTap={this.placeOrder}>立即预定</button>
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
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(PlaceOrderApplication);
