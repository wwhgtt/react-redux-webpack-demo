const React = require('react');
const PlaceDetail = require('../../component/place/place-detail.jsx');
const connect = require('react-redux').connect;
const dishHelper = require('../../helper/dish-hepler');
const getSubmitDishData = require('../../helper/order-helper').getSubmitDishData;
const actions = require('../../action/place-check-order/place-check-order');
const shopId = dishHelper.getUrlParam('shopId');
require('../../asset/style/style.scss');
require('./application.scss');

const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');

const PlaceCheckOrderApplication = React.createClass({
  displayName:'PlaceCheckOrderApplication',
  propTypes:{
    orderDetail:React.PropTypes.object,
    getPlaceCheckOrder:React.PropTypes.func,
    confirmBill:React.PropTypes.func,
    load:React.PropTypes.object,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
  },
  componentDidMount() {
    const { getPlaceCheckOrder } = this.props;
    getPlaceCheckOrder();
  },
  confirmBill() {
    const memo = this.refs.note.value;
    const { confirmBill, orderDetail } = this.props;

    const data = { shopId };

    Object.assign(data, {
      shopId,
      relatedId:sessionStorage.relatedId || 0,
      relatedType:1,
      orderType:orderDetail.type,
      serviceApproach:'totable',
      memo,
    }, getSubmitDishData(orderDetail.dishes, parseInt(shopId, 10) || 0));

    confirmBill(data);
  },
  render() {
    const { orderDetail, load, clearErrorMsg, errorMessage } = this.props;
    const dishCount = dishHelper.getDishesCount(orderDetail.dishes || []);
    const totalPrice = dishHelper.getDishesPrice(orderDetail.dishes || []);
    return (
      <div className="application">
        <div className="order-outer">
          <p className="shop-name">{orderDetail.shopName || '未知的门店'}</p>
          <div className="shop-head of">
            <span className="shop-chosen">已选商品</span>
            <span className="shop-total">共{dishCount}份</span>
            <a href=" javascript:;" className="shop-edit">修改订单</a>
          </div>
          <div className="order-list-outer">
            {
              orderDetail.dishes && orderDetail.dishes.length > 0 &&
              orderDetail.dishes.map((item, index) =>
                <PlaceDetail mainDish={item} key={index} />
              )
            }
          </div>
          <div className="totalPrice">
            总计：<span className="num price">{totalPrice}</span>
          </div>
        </div>
        <div className="options-group">
          <div className="option">
            <span className="option-title">备注</span>
            <div className="of">
              <input type="text" name="notes" className="option-input" placeholder="在这里输入备注哦" ref="note" />
            </div>
          </div>
        </div>
        <div className="btn-row btn-row-sure btn-ab" onTouchTap={this.confirmBill}>确认菜单</div>
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

module.exports = connect(state => state, actions)(PlaceCheckOrderApplication);
