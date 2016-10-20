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
const Toast = require('../../component/mui/toast.jsx');
const AdsColumn = require('../../component/dish-menu/ads-column.jsx');

const DishMenuApplication = React.createClass({
  displayName: 'DishMenuApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    fetchSendArea: React.PropTypes.func.isRequired,
    activeDishType: React.PropTypes.func.isRequired,
    orderDish: React.PropTypes.func.isRequired,
    showDishDetail: React.PropTypes.func.isRequired,
    showDishDesc: React.PropTypes.func.isRequired,
    confirmOrder: React.PropTypes.func.isRequired,
    removeAllOrders: React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    shopInfo:React.PropTypes.object.isRequired,
    // MapedStatesToProps
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
    dishDetailData: React.PropTypes.object,
    dishDescData: React.PropTypes.object,
    takeawayServiceProps: React.PropTypes.object,
    openTimeList: React.PropTypes.array,
    isAcceptTakeaway: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
  },
  componentDidMount() {
    const { fetchMenuData, fetchSendArea, fetchOrderDiscountInfo } = this.props;
    fetchMenuData().then(
      fetchOrderDiscountInfo
    );
    fetchSendArea();
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
            openTimeList, isAcceptTakeaway, errorMessage, shopInfo } = this.props;
    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc, removeAllOrders, clearErrorMsg } = this.props;
    const marketList = shopInfo.marketList;
    const marketListUpdate = shopInfo.marketListUpdate;
    return (
      <div className="application">
        <AdsColumn
          dishesData={dishesData} shopInfo={shopInfo} marketList={marketList}
          marketListUpdate={marketListUpdate}
        />
        <DishTypeScroller
          dishTypesData={dishTypesData} dishesData={dishesData} activeDishTypeId={activeDishTypeId}
          onDishTypeElementTap={activeDishType}
        />
        <DishScroller
          dishTypesData={dishTypesData} dishesData={dishesData} diningForm={shopInfo.diningForm}
          activeDishTypeId={activeDishTypeId} onScroll={activeDishType} marketList={marketList}
          onOrderBtnTap={orderDish} onPropsBtnTap={showDishDetail} onImageBtnTap={showDishDesc}
        />
        <CartContainer
          dishes={dishesData} takeawayServiceProps={takeawayServiceProps}
          openTimeList={openTimeList} isAcceptTakeaway={isAcceptTakeaway}
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
        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuApplication);
