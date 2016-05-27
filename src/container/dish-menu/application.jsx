const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu');
require('../../asset/style/style.scss');
require('./application.scss');
const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishScroller = require('../../component/dish-menu/dish-scroller.jsx');
const CartContainer = require('../../component/dish-menu/cart/cart-container.jsx');

const DishMenuApplication = React.createClass({
  displayName: 'DishMenuApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    activeDishType: React.PropTypes.func.isRequired,
    tryToOrderDish: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    activeDishTypeId: React.PropTypes.number.isRequired,
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
  },
  componentDidMount() {
    this.props.fetchMenuData();
  },
  componentDidUpdate() {
  },
  render() {
    const { activeDishTypeId, dishTypesData, dishesData } = this.props; // states
    const { activeDishType, tryToOrderDish } = this.props; // actions
    return (
      <div className="application">
        <DishTypeScroller
          dishTypesData={dishTypesData} dishesData={dishesData} activeDishTypeId={activeDishTypeId}
          onDishTypeItemTap={activeDishType}
        />
        <DishScroller
          dishTypesData={dishTypesData} dishesData={dishesData}
          activeDishTypeId={activeDishTypeId} onScroll={activeDishType} onOrderBtnTap={tryToOrderDish}
        />
        <CartContainer dishesData={dishesData} onBillBtnTap={() => {}} />
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuApplication);
