const React = require('react');
const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');
const connect = require('react-redux').connect;
const actions = require('../../action/place-check-order/place-check-order');
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
  setTotalPrice(orderDetail) {
    let totalPrice = 0;
    if (orderDetail.orderMetas) {
      orderDetail.orderMetas.forEach((item, index) => {
        item.dishItems.forEach((itemt, indext) => {
          totalPrice += itemt.price;
        });
      });
    }
    return totalPrice.toFixed(2);
  },
  confirmBill() {
    const note = this.refs.note.value;
    const { confirmBill } = this.props;
    confirmBill(note);
  },
  render() {
    const { orderDetail, load, clearErrorMsg, errorMessage } = this.props;
    const totalPrice = this.setTotalPrice(orderDetail);
    return (
      <div className="application">
        <div className="order-outer">
          <p className="shop-name">Yakitori(世纪城店)</p>
          <div className="shop-head of">
            <span className="shop-chosen">已选商品</span>
            <span className="shop-total">共3份</span>
            <a href=" javascript:;" className="shop-edit">修改订单</a>
          </div>
          <div className="order-list-outer">
            {
              orderDetail.orderMetas && orderDetail.orderMetas.length > 0 &&
              orderDetail.orderMetas.map((item, index) =>
                item.dishItems.map((itemt, indext) =>
                  <DishDetail mainDish={itemt} key={indext} />
                )
              )
            }
          </div>
          <div className="totalPrice">
            总计：<span className="num">￥{totalPrice}</span>
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
