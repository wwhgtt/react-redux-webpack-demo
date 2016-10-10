const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu-zc');
require('../../asset/style/style.scss');
require('./application.scss');
require('../../component/dish-menu/cart/cart.scss');
const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const DishDetailContainer = require('../../component/dish-menu/detail/dish-detail-container.jsx');
const DishDescPopup = require('../../component/dish-menu/detail/dish-desc-popup.jsx');
const QuickMenu = require('../../component/dish-menu/cart/quick-menu.jsx');
const Toast = require('../../component/mui/toast.jsx');
const helper = require('../../helper/dish-hepler');
const cartHelper = require('../../helper/order-dinner-cart-helper');
const tableKey = helper.getUrlParam('tableKey');
const tableId = helper.getUrlParam('tableId');
const shopId = helper.getUrlParam('shopId');

const DishMenuZcApplication = React.createClass({
  displayName: 'DishMenuZcApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    activeDishType: React.PropTypes.func.isRequired,
    orderDish: React.PropTypes.func.isRequired,
    showDishDetail: React.PropTypes.func.isRequired,
    showDishDesc: React.PropTypes.func.isRequired,
    fetchOrderDiscountInfo:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    showErrMsgFunc:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    dishDescData: React.PropTypes.object,
    dishMenuZcReducer: React.PropTypes.object.isRequired,
    dishMenuReducer: React.PropTypes.object.isRequired,
    callBell: React.PropTypes.func.isRequired,
    clearBell: React.PropTypes.func.isRequired,
    fetchTableId: React.PropTypes.func.isRequired,
    // saveTableParam
    saveTableParam: React.PropTypes.func.isRequired,
  },
  componentDidMount() {
    // tableId 或者 tableKey 存入localStorage
    const { fetchMenuData, fetchOrderDiscountInfo, fetchTableId, saveTableParam } = this.props;
    const localTableKey = (cartHelper.getTableInfoInLocalStorage(shopId) || {}).tableKey || '';
    const localTableId = (cartHelper.getTableInfoInLocalStorage(shopId) || {}).tableId || '';
    saveTableParam({ tableKey: tableKey || '', tableId: tableId || '' });

    fetchMenuData().then(
      fetchOrderDiscountInfo
    );

    fetchTableId(localTableKey, localTableId);
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
    const { callMsg, callAble, timerStatus, serviceStatus, isShowButton } = this.props.dishMenuZcReducer;
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, dishDescData,
            errorMessage, openTimeList } = this.props.dishMenuReducer;
    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc,
            clearErrorMsg, callBell, clearBell, showErrMsgFunc } = this.props;
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
        <QuickMenu
          callBell={callBell}
          clearBell={clearBell}
          callMsg={callMsg}
          callAble={callAble}
          timerStatus={timerStatus}
          dishes={dishesData}
          serviceStatus={serviceStatus}
          openTimeList={openTimeList}
          isShowButton={isShowButton}
          shopNotOpenMsg={showErrMsgFunc}
        />
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuZcApplication);
