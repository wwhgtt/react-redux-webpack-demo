const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/queue-check-order/queue-check-order');
require('../../asset/style/style.scss');

const config = require('../../config');
const dishHelper = require('../../helper/dish-helper');

const QueueDetail = require('../../component/book/book-detail.jsx');
const getSubmitDishData = require('../../helper/order-helper').getSubmitDishData;
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const shopId = dishHelper.getUrlParam('shopId');

require('./application.scss');

const QueueCheckOrderApplication = React.createClass({
  displayName:'QueueCheckOrderApplication',
  propTypes:{
    orderDetail:React.PropTypes.object,
    getQueueCheckOrder:React.PropTypes.func,
    confirmBill:React.PropTypes.func,
    load:React.PropTypes.object,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
  },
  componentDidMount() {
    const { getQueueCheckOrder } = this.props;
    getQueueCheckOrder();
  },
  confirmBill() {
    const memo = this.refs.note.value;
    const { confirmBill, orderDetail } = this.props;

    const data = { shopId };

    Object.assign(data, {
      shopId,
      relatedId:sessionStorage.PDrelatedId || 0,
      relatedType:2,
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
            <a href={`${config.getMoreTSDishesURL}?shopId=${shopId}&type=PD`} className="shop-edit">修改订单</a>
          </div>
          <div className="order-list-outer">
            {
              orderDetail.dishes && orderDetail.dishes.length > 0 &&
              orderDetail.dishes.map((item, index) =>
                <QueueDetail mainDish={item} key={index} />
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
              <input type="text" name="notes" className="option-input" placeholder="在这里输入备注哦" maxLength="80" ref="note" />
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

module.exports = connect(state => state, actions)(QueueCheckOrderApplication);
