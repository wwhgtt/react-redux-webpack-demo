const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/place-order-detail/place-order-detail');
require('../../asset/style/style.scss');
require('./application.scss');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const PlaceInfoList = require('../../component/place/place-info-list.jsx');
const PlaceInfoHover = require('../../component/place/place-info-hover.jsx');
const defaultShopLogo = require('../../asset/images/logo_default.svg');

const PlaceOrderDetailApplication = React.createClass({
  displayName:'PlaceOrderDetailApplication',
  propTypes:{
    load:React.PropTypes.object,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
    orderDetail:React.PropTypes.object,
    orderInfo:React.PropTypes.object,
    getPlaceCheckOrder:React.PropTypes.func,
    getPlaceOrderInfo:React.PropTypes.func,
  },
  getInitialState() {
    return { showBill:false };
  },
  componentDidMount() {
    const { getPlaceCheckOrder, getPlaceOrderInfo } = this.props;
    getPlaceOrderInfo(getPlaceCheckOrder);
  },
  getHoverState() {
    this.setState({ showBill:false });
  },
  checkBill() {
    this.setState({ showBill:true });
  },
  render() {
    const { load, errorMessage, clearErrorMsg, orderDetail, orderInfo } = this.props;
    const { showBill } = this.state;
    return (
      <div className="application">
        <div className="content">
          <div className="content-shop">
            <img className="content-shop-icon" src={orderInfo.shopLogo || defaultShopLogo} alt="" />
            <p className="content-shop-desc ellipsis">{orderInfo.shopName || '未知的门店'}</p>
          </div>
          <div className="divider">
            <span className="divider-title">预订信息</span>
          </div>
          <div className="content-logo content-logo-placesuccess"></div>
          <PlaceInfoList orderInfo={orderInfo} />
          <div className="btn-row btn-row-sure btn-row-mt" onTouchTap={this.checkBill}>查看菜单</div>
          <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
          {
            showBill && <PlaceInfoHover orderDetail={orderDetail} setHoverState={this.getHoverState} />
          }
          </ReactCSSTransitionGroup>
        </div>
        {
          load.status ?
            <Loading word={load.word} />
          :
            false
        }
        {
        errorMessage ?
          <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />
        :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(PlaceOrderDetailApplication);
