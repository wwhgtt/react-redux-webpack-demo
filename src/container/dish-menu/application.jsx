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
    const { fetchMenuData, fetchSendArea, fetchOrderDiscountInfo } = this.props;
    fetchMenuData().then(
      fetchOrderDiscountInfo
    );
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
  getWrapRect() {
    const { shopInfo } = this.props;
    const marketListUpdate = shopInfo.marketListUpdate;
    let height = 96;
    if (marketListUpdate && marketListUpdate.length) {
      height += 34;
    }
    return { height, minTop: 0 };
  },
  setScrollTop(direction) {
    const rect = this.getWrapRect();
    const { scrollerWrap, mesthead } = this._cache;
    let _top = 0;

    if (direction.y === 1 && direction.scrollY < 0) {
      _top = Math.max(rect.height - Math.abs(direction.scrollY), rect.minTop);
    } else if (direction.y === -1 && direction.scrollY > 0) {
      _top = Math.min((scrollerWrap._top || 0) + direction.scrollY, rect.height);
    } else {
      return;
    }

    scrollerWrap._top = _top;
    scrollerWrap.style.top = `${_top}px`;
    mesthead.style.top = `${-(rect.height - _top)}px`;
  },
  render() {
    // states
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, dishDescData, confirmOrder, takeawayServiceProps,
            openTimeList, isAcceptTakeaway, errorMessage, shopInfo, normalDiscountProps, shopLogo, dishesDataDuplicate } = this.props;
    // actions
    const { activeDishType, orderDish, showDishDetail, showDishDesc, removeAllOrders, clearErrorMsg } = this.props;
    const marketList = shopInfo.marketList;
    const marketListUpdate = shopInfo.marketListUpdate;
    const isMember = normalDiscountProps && normalDiscountProps.isMember || false;
    let { dishPageTpl } = this.props;


    return (
      <div className="application">
        {!isMember &&
          <div className="register notice">
            <a href={`/member/register${location.search}`}>去注册</a>
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
