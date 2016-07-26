const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu');
require('../../asset/style/style.scss');
require('./application.scss');
const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const CartContainer = require('../../component/dish-menu/cart/cart-container.jsx');
const DishDetailContainer = require('../../component/dish-menu/detail/dish-detail-container.jsx');
const DishDescPopup = require('../../component/dish-menu/detail/dish-desc-popup.jsx');

const DishMenuApplication = React.createClass({
  displayName: 'DishMenuApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    fetchServiceProps: React.PropTypes.func.isRequired,
    activeDishType: React.PropTypes.func.isRequired,
    orderDish: React.PropTypes.func.isRequired,
    showDishDetail: React.PropTypes.func.isRequired,
    showDishDesc: React.PropTypes.func.isRequired,
    confirmOrder: React.PropTypes.func.isRequired,
    removeAllOrders: React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
    dishDetailData: React.PropTypes.object,
    dishDescData: React.PropTypes.object,
    takeawayServiceProps: React.PropTypes.object,
    dishBoxChargeInfo:React.PropTypes.object,
    openTimeList: React.PropTypes.array,
    sendTimeList: React.PropTypes.array,
  },
  componentDidMount() {
    const { fetchMenuData, fetchServiceProps, fetchOrderDiscountInfo } = this.props;
    fetchMenuData().then(
      fetchOrderDiscountInfo()
    );
    fetchServiceProps();
  },
  componentDidUpdate() {
  },
  onDishDetailAddBtnTap(dishData) {
    const { orderDish, showDishDetail } = this.props;
    showDishDetail();
    orderDish(dishData);
  },
  render() {
    // states
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, dishDescData, confirmOrder, takeawayServiceProps,
            openTimeList, sendTimeList, dishBoxChargeInfo } = this.props;
    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc, removeAllOrders } = this.props;
    return (
      <div className="application">
        <DishTypeScroller
          dishTypesData={dishTypesData} dishesData={dishesData} activeDishTypeId={activeDishTypeId}
          onDishTypeElementTap={activeDishType}
        />
        <DishScroller
          dishTypesData={dishTypesData} dishesData={dishesData}
          activeDishTypeId={activeDishTypeId} onScroll={activeDishType}
          onOrderBtnTap={orderDish} onPropsBtnTap={showDishDetail} onImageBtnTap={showDishDesc}
        />
        <CartContainer
          dishes={dishesData} takeawayServiceProps={takeawayServiceProps}
          openTimeList={openTimeList} sendTimeList={sendTimeList} dishBoxChargeInfo={dishBoxChargeInfo}
          onOrderBtnTap={orderDish} onBillBtnTap={confirmOrder} onClearBtnTap={removeAllOrders}
        />
        {dishDetailData !== undefined ?
          <DishDetailContainer dish={dishDetailData} onCloseBtnTap={showDishDetail} onAddToCarBtnTap={this.onDishDetailAddBtnTap} />
          : false
        }
        {dishDescData !== undefined ?
          <DishDescPopup dish={dishDescData} onCloseBtnTap={showDishDesc} />
          : false
        }
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuApplication);
