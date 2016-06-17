const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu');
require('../../asset/style/style.scss');
require('./application.scss');
const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const CartContainer = require('../../component/dish-menu/cart/cart-container.jsx');
const DishDetailContainer = require('../../component/dish-menu/detail/dish-detail-container.jsx');

const DishMenuApplication = React.createClass({
  displayName: 'DishMenuApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    activeDishType: React.PropTypes.func.isRequired,
    orderDish: React.PropTypes.func.isRequired,
    showDishDetail: React.PropTypes.func.isRequired,
<<<<<<< HEAD
    onBillBtnTap: React.PropTypes.func.isRequired,
=======
    setDishCookie: React.PropTypes.func.isRequired,
>>>>>>> a122004ab61e22201bf3912cbcc3b01306e09d0b
    // MapedStatesToProps
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
    dishDetailData: React.PropTypes.object,
  },
  componentDidMount() {
    this.props.fetchMenuData();
  },
  componentDidUpdate() {
  },
  onDishDetailAddBtnTap(dishData) {
    const { orderDish, showDishDetail } = this.props;
    showDishDetail();
    orderDish(dishData);
  },
  render() {
<<<<<<< HEAD
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, onBillBtnTap } = this.props; // states
=======
    const { activeDishTypeId, dishTypesData, dishesData, dishDetailData, setDishCookie } = this.props; // states
>>>>>>> a122004ab61e22201bf3912cbcc3b01306e09d0b
    const { activeDishType, orderDish, showDishDetail } = this.props; // actions
    return (
      <div className="application">
        <DishTypeScroller
          dishTypesData={dishTypesData} dishesData={dishesData} activeDishTypeId={activeDishTypeId}
          onDishTypeElementTap={activeDishType}
        />
        <DishScroller
          dishTypesData={dishTypesData} dishesData={dishesData}
          activeDishTypeId={activeDishTypeId} onScroll={activeDishType} onOrderBtnTap={orderDish} onPropsBtnTap={showDishDetail}
        />
<<<<<<< HEAD
        <CartContainer dishes={dishesData} onOrderBtnTap={orderDish} onBillBtnTap={onBillBtnTap} />
        {dishDetailData !== undefined ?
          <DishDetailContainer dish={dishDetailData} onCloseBtnTap={showDishDetail} onAddToCarBtnTap={this.onDishDetailAddBtnTap} />
          : false
        }
=======
        <CartContainer dishesData={dishesData} onOrderBtnTap={orderDish} onBillBtnTap={setDishCookie} />
          {dishDetailData !== undefined ?
            <DishDetailContainer dishData={dishDetailData} onCloseBtnTap={showDishDetail} onAddToCarBtnTap={this.onDishDetailAddBtnTap} />
            : false
          }
>>>>>>> a122004ab61e22201bf3912cbcc3b01306e09d0b
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuApplication);
