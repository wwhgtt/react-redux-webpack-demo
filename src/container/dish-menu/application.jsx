const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu');
const findDOMNode = require('react-dom').findDOMNode;

require('../../asset/style/style.scss');
require('./application.scss');

const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const CartContainer = require('../../component/dish-menu/cart/cart-container.jsx');
const DishDetailContainer = require('../../component/dish-menu/detail/dish-detail-container.jsx');
const DishDescPopup = require('../../component/dish-menu/detail/dish-desc-popup.jsx');
const Toast = require('../../component/mui/toast.jsx');
const DishMesthead = require('../../component/dish-menu/dish-mesthead.jsx');

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
    fetchDishMarketInfos: React.PropTypes.func.isRequired,

    // MapedStatesToProps
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
    dishesDataDuplicate:  React.PropTypes.array,
    dishDetailData: React.PropTypes.object,
    dishDescData: React.PropTypes.object,
    takeawayServiceProps: React.PropTypes.object,
    openTimeList: React.PropTypes.array,
    isAcceptTakeaway: React.PropTypes.bool,
    normalDiscountProps: React.PropTypes.object,
    discountProps: React.PropTypes.object,
    enableMemberRegistry: React.PropTypes.bool,
    dishPageTpl: React.PropTypes.string,
    shopLogo: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
  },
  getDefaultProps() {
    return {
      dishPageTpl: 'default',
    };
  },
  getInitialState() {
    return {
      isMinMesthead: false,
    };
  },
  componentDidMount() {
    const { fetchMenuData, fetchSendArea, fetchOrderDiscountInfo, fetchDishMarketInfos } = this.props;
    fetchMenuData()
      .then(fetchDishMarketInfos)
      .then(fetchOrderDiscountInfo);
    fetchSendArea();

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
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, dishDescData, confirmOrder, takeawayServiceProps,
            openTimeList, isAcceptTakeaway, errorMessage, shopInfo, shopLogo, dishesDataDuplicate } = this.props;
    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc, removeAllOrders, clearErrorMsg } = this.props;
    const marketList = shopInfo.marketList;
    const marketListUpdate = shopInfo.marketListUpdate;
    const { dishPageTpl, enableMemberRegistry, discountProps } = this.props;
    const isMember = discountProps && discountProps.isMember || false;

    return (
      <div className="application">
        {(enableMemberRegistry && isMember === false) &&
          <div className="register notice">
            <a href={`/member/register${location.search}&returnUrl=${encodeURIComponent(location.href)}`}>去注册</a>
            <p>注册会员享受更多福利哟～</p>
          </div>
        }
        <div className="main">
          <DishMesthead
            registered={isMember}
            dishesData={dishesData}
            shopInfo={shopInfo}
            shopLogo={shopLogo}
            marketList={marketList}
            marketListUpdate={marketListUpdate}
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
        </div>
        <CartContainer
          dishes={dishesDataDuplicate} takeawayServiceProps={takeawayServiceProps}
          openTimeList={openTimeList} isAcceptTakeaway={isAcceptTakeaway}
          onOrderBtnTap={orderDish} onBillBtnTap={confirmOrder} onClearBtnTap={removeAllOrders}
        />
        {dishDetailData !== undefined ?
          <DishDetailContainer
            dish={dishDetailData}
            onCloseBtnTap={showDishDetail}
            onAddToCarBtnTap={this.onDishDetailAddBtnTap}
          />
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
