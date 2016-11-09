const React = require('react');
require('./place-info-hover.scss');
const DishDetail = require('../../component/order-detail-uncheck/dish-detail.jsx');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'ShowBasicInfo',
  propTypes:{
    orderDetail:React.PropTypes.object,
    setHoverState:React.PropTypes.func,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  setTotalPrice(orderDetail) {
    let totalPrice = 0;
    let totalPart = 0;
    if (orderDetail.orderMetas) {
      orderDetail.orderMetas.forEach((item, index) => {
        item.dishItems.forEach((itemt, indext) => {
          totalPrice += itemt.price || 0;
          totalPart += itemt.num || 0;
        });
      });
    }
    return { totalPrice:totalPrice.toFixed(2), totalPart };
  },
  closeHover(bool, e) {
    e.preventDefault();
    const { setHoverState } = this.props;
    setHoverState(bool);
  },
  render() {
    const { orderDetail } = this.props;
    const total = this.setTotalPrice(orderDetail);
    return (
      <div className="float-layer">
        <div className="float-layer-hover"></div>
        <div className="float-layer-content">
          <div className="float-layer-inner">
            <p className="bill-info">
              菜单信息
              <i className="bill-close" onTouchTap={(e) => this.closeHover(false, e)}></i>
            </p>
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
              <span className="part">共{total.totalPart}份</span>
              总计：<span className="num">￥{total.totalPrice}</span>
            </div>
          </div>
          <div className="options-group options-group-spe">
            <div className="option">
              <span className="option-title">备注</span>
              <div className="option-content">我是徐大宝宝</div>
            </div>
          </div>
          <div className="copyright"></div>
        </div>
      </div>
    );
  },
});
