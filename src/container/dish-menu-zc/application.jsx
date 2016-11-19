const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu-zc');
const findDOMNode = require('react-dom').findDOMNode;

require('../../asset/style/style.scss');
require('../dish-menu/application.scss');
require('./application.scss');
require('../../component/dish-menu/cart/cart.scss');

const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const DishDetailContainer = require('../../component/dish-menu/detail/dish-detail-container.jsx');
const DishDescPopup = require('../../component/dish-menu/detail/dish-desc-popup.jsx');
const QuickMenu = require('../../component/dish-menu/cart/quick-menu.jsx');
const DishMesthead = require('../../component/dish-menu/dish-mesthead.jsx');
const Toast = require('../../component/mui/toast.jsx');
const helper = require('../../helper/dish-helper');
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
    fetchDishMarketInfos: React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    showErrMsgFunc:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    dishDescData: React.PropTypes.object,
    dishMenuZcReducer: React.PropTypes.object.isRequired,
    dishMenuReducer: React.PropTypes.object.isRequired,
    callBell: React.PropTypes.func.isRequired,
    clearBell: React.PropTypes.func.isRequired,
    fetchTableId: React.PropTypes.func.isRequired,
    dishesDataDuplicate:  React.PropTypes.array,
    dishDetailData: React.PropTypes.object,
    openTimeList: React.PropTypes.array,
    normalDiscountProps: React.PropTypes.object,
    dishPageTpl: React.PropTypes.string,
    // saveTableParam
    saveTableParam: React.PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      dishMenuReducer: {
        dishPageTpl: 'default',
      },
    };
  },
  getInitialState() {
    return {
      isMinMesthead: false,
    };
  },
  componentDidMount() {
    // tableId 或者 tableKey 存入localStorage
    const { fetchMenuData, fetchOrderDiscountInfo, fetchTableId, saveTableParam } = this.props;
    if (tableKey || tableId) {
      saveTableParam({ tableKey, tableId });
    }

    const localTableKey = (cartHelper.getTableInfoInSessionStorage(shopId) || {}).tableKey || '';
    const localTableId = (cartHelper.getTableInfoInSessionStorage(shopId) || {}).tableId || '';

    fetchMenuData()
      .then(fetchOrderDiscountInfo);

    fetchTableId(localTableKey, localTableId);

    const el = findDOMNode(this);
    this._cache = {
      mesthead: el.querySelector('.dish-mesthead'),
      scrollerWrap: el.querySelector('.scroller-wrap'),
    };
  },
  componentDidUpdate() {
  },
  onDishDetailAddBtnTap(dishData) {
    const { orderDish, showDishDetail } = this.props;
    showDishDetail();
    orderDish(dishData);
  },
  setScrollTop(args) {
    const { scrollerWrap, mesthead } = this._cache;
    const rect = { height: mesthead.height || mesthead.clientHeight };
    const y = args.y;
    let _top = mesthead._top || 0;

    if (y < 0) {
      _top = Math.max(y, -rect.height);
    } else if (y > 0) {
      _top = Math.min(_top + y, 0);
    } else {
      return;
    }

    if (mesthead._top !== _top) {
      Object.assign(mesthead, { _top }, rect);
      scrollerWrap.style.top = `${rect.height + _top}px`;
      mesthead.style.top = `${_top}px`;
    }
  },
  render() {
    // states
    const { callMsg, callAble, timerStatus, serviceStatus, isShowButton } = this.props.dishMenuZcReducer;
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, dishDescData,
            errorMessage, openTimeList, shopInfo, shopLogo,
            dishesDataDuplicate } = this.props.dishMenuReducer;

    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc,
            clearErrorMsg, callBell, clearBell, showErrMsgFunc } = this.props;

    const marketList = shopInfo.marketList;
    const marketListUpdate = shopInfo.marketListUpdate;
    const { dishPageTpl = 'default', enableMemberRegistry, discountProps } = this.props.dishMenuReducer;
    const isMember = discountProps && discountProps.isMember;

    return (
      <div className="application">
        {
          (enableMemberRegistry && isMember === false) &&
            <div className="register notice">
              <a href={`/member/register${location.search}&returnUrl=${encodeURIComponent(location.href)}`}>去注册</a>
              <p>注册会员享受更多福利哟～</p>
            </div>
        }
        <div className="main">
          <DishMesthead
            shopInfo={shopInfo}
            shopLogo={shopLogo}
          />
          <div ref="scrollWrap" className={`${dishPageTpl} scroller-wrap`}>
            <DishTypeScroller
              theme={dishPageTpl}
              dishTypesData={dishTypesData} dishesData={dishesData} activeDishTypeId={activeDishTypeId}
              onDishTypeElementTap={activeDishType} dishesDataDuplicate={dishesDataDuplicate}
            />
            <DishScroller
              theme={dishPageTpl}
              dishTypesData={dishTypesData} dishesData={dishesData} diningForm={shopInfo.diningForm}
              activeDishTypeId={activeDishTypeId} onScroll={activeDishType} marketList={marketList}
              onOrderBtnTap={orderDish} onPropsBtnTap={showDishDetail} onImageBtnTap={showDishDesc}
              marketListUpdate={marketListUpdate}
              onScrolling={(direction) => {
                this.setScrollTop(direction);
              }}
              dishesDataDuplicate={dishesDataDuplicate}
            />
          </div>
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
        <QuickMenu
          callBell={callBell}
          clearBell={clearBell}
          callMsg={callMsg}
          callAble={callAble}
          timerStatus={timerStatus}
          dishes={dishesDataDuplicate}
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
