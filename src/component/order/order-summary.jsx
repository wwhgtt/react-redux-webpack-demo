const React = require('react');
const config = require('../../config.js');
const helper = require('../../helper/order-helper.js');
const OrderedDish = require('./ordered-dish.jsx');
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
module.exports = React.createClass({
  displayName: 'OrderSummary',
  propTypes: {
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.object.isRequired,
    shopId:React.PropTypes.string.isRequired,
  },
  componentDidMount() {

  },
  buildSmallChangeProps(carryRuleVO, dishesPrice, serviceProps) {
    if (!carryRuleVO) {
      return false;
    }
    const smallChange = helper.clearSmallChange(carryRuleVO, dishesPrice, serviceProps).smallChange;
    if (smallChange === 0) {
      return false;
    } else if (smallChange > 0) {
      return (
        <p className="order-summary-entry clearfix">
          <span className="order-title">自动抹零:</span>
          <span className="order-discount discount">
            {smallChange}
          </span>
        </p>
      );
    }
    return (
      <p className="order-summary-entry clearfix">
        <span className="order-title">自动进位:</span>
        <span className="order-discount discount">
          {Math.abs(smallChange)}
        </span>
      </p>
    );
  },
  render() {
    const { serviceProps, commercialProps, orderedDishesProps, shopId } = this.props;
    const dishesPrice = orderedDishesProps.dishes && orderedDishesProps.dishes.length ? getDishesPrice(orderedDishesProps.dishes) : 0;
    return (
      <div className="order-summary-detail">
        {orderedDishesProps.dishes && orderedDishesProps.dishes.length ?
          <div>
            <div className="options-group">
              <a className="order-prop-option order-shop" href={config.shopDetailURL + '?shopId=' + shopId}>
                <img className="order-shop-icon" src={commercialProps.commercialLogo} alt="" />
                <p className="order-shop-desc ellipsis">{commercialProps.name}</p>
              </a>
              {orderedDishesProps.dishes.map(dish => (<OrderedDish key={dish.id} dish={dish} />))}
              <div className="order-summary">
                {helper.getDishBoxPrice() ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">餐盒费:</span>
                    <span className="order-discount price">{helper.getDishBoxPrice()}</span>
                  </p>
                  :
                  false
                }
                {serviceProps.deliveryProps && serviceProps.deliveryProps.deliveryPrice ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">配送费:</span>
                    <span className="order-discount price">{serviceProps.deliveryProps.deliveryPrice}</span>
                  </p>
                  :
                  false
                }
                {serviceProps.couponsProps.inUseCoupon ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">优惠券优惠:</span>
                    <span className="order-discount discount">
                      {
                        helper.countPriceByCoupons(
                          serviceProps.couponsProps.inUseCouponDetail,
                          dishesPrice
                        )
                      }
                    </span>
                  </p>
                  :
                  false
                }
                {serviceProps.integralsInfo && serviceProps.integralsInfo.isChecked && commercialProps.carryRuleVO ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">积分抵扣:</span>
                    <span className="order-discount discount">
                      {helper.countIntegralsToCash(
                        helper.clearSmallChange(
                          commercialProps.carryRuleVO,
                          dishesPrice,
                          serviceProps).priceWithClearSmallChange,
                        serviceProps.integralsInfo.integralsDetail
                      ).commutation}
                    </span>
                    <span className="order-integral">
                      {helper.countIntegralsToCash(
                        helper.clearSmallChange(
                          commercialProps.carryRuleVO,
                          dishesPrice,
                          serviceProps).priceWithClearSmallChange,
                        serviceProps.integralsInfo.integralsDetail
                      ).integralInUsed}
                    </span>
                  </p>
                  :
                  false
                }
                {serviceProps.deliveryProps && serviceProps.deliveryProps.freeDeliveryPrice
                  && dishesPrice >= serviceProps.deliveryProps.freeDeliveryPrice ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">满{serviceProps.deliveryProps.freeDeliveryPrice}元减免配送费</span>
                    <span className="order-discount discount">
                      {serviceProps.deliveryProps.deliveryPrice}
                    </span>
                  </p>
                  :
                  false
                }
                {this.buildSmallChangeProps(commercialProps.carryRuleVO, dishesPrice, serviceProps)}

              </div>
              <div className="order-prop-option order-total clearfix">
                <div className="order-total-left">
                  <span className="text-dove-grey">总计: </span>
                  <span className="price">{
                    dishesPrice
                    + helper.getDishBoxPrice()
                    + Number(helper.countDeliveryPrice(serviceProps.deliveryProps))
                  }</span>
                </div>
                {commercialProps.carryRuleVO ?
                  <div>
                    <div className="order-total-left">
                      <span className="text-dove-grey">优惠: </span>
                      <span className="price">
                        {helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange > 0 ?
                          helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)
                          + helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange
                          :
                          helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)
                        }
                      </span>
                    </div>
                    <div className="order-total-right">
                      <span className="text-dove-grey">实付: </span>
                      <span className="price">
                        {helper.countFinalPrice(orderedDishesProps, serviceProps, commercialProps)}
                      </span>
                    </div>
                  </div>
                  :
                  false
                }
              </div>
            </div>
          </div>
          :
          false
        }
      </div>
    );
  },
});
