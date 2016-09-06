const React = require('react');
const config = require('../../config.js');
const helper = require('../../helper/order-helper.js');
const OrderedDish = require('./ordered-dish.jsx');
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const isSingleDishWithoutProps = require('../../helper/dish-hepler.js').isSingleDishWithoutProps;

require('./order-summary.scss');

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
  buildOrderedElements(orderedDishes) {
    function divideDishes(dishes) {
      return [].concat.apply(
        [], dishes.map(dish => {
          if (isSingleDishWithoutProps(dish)) {
            return [Object.assign({}, dish,
              { key:`${dish.id}` },
            )];
          }
          return dish.order.map((dishOrder, idx) =>
            Object.assign({}, dish,
              { key:`${dish.id}-${idx}` },
              { order:[Object.assign({}, dishOrder)] }
            )
          );
        })
      );
    }
    const dividedDishes = divideDishes(orderedDishes);
    return dividedDishes.map(dish => (<OrderedDish key={dish.key} dish={dish} />));
  },
  render() {
    const { serviceProps, commercialProps, orderedDishesProps, shopId } = this.props;
    const dishesPrice = orderedDishesProps.dishes && orderedDishesProps.dishes.length ? getDishesPrice(orderedDishesProps.dishes) : 0;
    if (!orderedDishesProps.dishes || !orderedDishesProps.dishes.length) return false;

    const orderedElements = this.buildOrderedElements(orderedDishesProps.dishes);
    return (
      <div className="options-group">
        <a className="option order-shop" href={config.shopDetailURL + '?shopId=' + shopId}>
          <img className="order-shop-icon" src={commercialProps.commercialLogo} alt="" />
          <p className="order-shop-desc ellipsis">{commercialProps.name}</p>
        </a>
        {orderedElements}
        <div className="order-summary">
          {serviceProps.deliveryProps && serviceProps.deliveryProps.deliveryPrice ?
            <p className="order-summary-entry clearfix">
              <span className="option-title">配送费:</span>
              <span className="order-discount price">{serviceProps.deliveryProps.deliveryPrice}</span>
            </p>
            :
            false
          }
          {helper.getDishBoxPrice() ?
            <p className="order-summary-entry clearfix">
              <span className="option-title">餐盒费:</span>
              <span className="order-discount price">{helper.getDishBoxPrice()}</span>
            </p>
            :
            false
          }
          {commercialProps.carryRuleVO && helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange < 0 ?
            <p className="order-summary-entry clearfix">
              <span className="option-title">尾数调整:</span>
              <span className="order-discount price">
                {Math.abs(helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange)}
              </span>
            </p>
            :
            false
          }
        </div>
        <div className="order-summary">
          {serviceProps.discountProps.inUseDiscount ?
            <p className="order-summary-entry clearfix">
              <span className="option-title option-title--icon order-summary-icon1">会员优惠:</span>
              <span className="order-discount discount">
                {serviceProps.discountProps.inUseDiscount}
              </span>
            </p>
            :
            false
          }
          {serviceProps.deliveryProps && serviceProps.deliveryProps.freeDeliveryPrice >= 0 && serviceProps.deliveryProps.deliveryPrice
            && dishesPrice >= serviceProps.deliveryProps.freeDeliveryPrice && serviceProps.deliveryProps.deliveryPrice !== 0 ?
            <p className="order-summary-entry clearfix">
              <span className="option-title option-title--icon order-summary-icon2">满{serviceProps.deliveryProps.freeDeliveryPrice}元减免配送费</span>
              <span className="order-discount discount">
                {serviceProps.deliveryProps.deliveryPrice}
              </span>
            </p>
            :
            false
          }
          {serviceProps.couponsProps.inUseCoupon ?
            <p className="order-summary-entry clearfix">
              <span className="option-title option-title--icon order-summary-icon3">优惠券优惠:</span>
              <span className="order-discount discount">
                {serviceProps.discountProps.discountInfo && serviceProps.discountProps.discountInfo.isChecked ?
                  helper.countPriceByCoupons(
                    serviceProps.couponsProps.inUseCouponDetail,
                    helper.getPriceCanBeUsedToBenefit(dishesPrice, serviceProps.deliveryProps)
                      - serviceProps.discountProps.inUseDiscount,
                  )
                  :
                  helper.countPriceByCoupons(
                    serviceProps.couponsProps.inUseCouponDetail,
                    helper.getPriceCanBeUsedToBenefit(dishesPrice, serviceProps.deliveryProps),
                  )
                }
              </span>
            </p>
            :
            false
          }

          {serviceProps.integralsInfo && serviceProps.integralsInfo.isChecked && commercialProps.carryRuleVO ?
            <p className="order-summary-entry clearfix">
              <span className="option-title option-title--icon order-summary-icon4">积分抵扣:</span>
              <span className="order-discount discount">
                {helper.countIntegralsToCash(
                  Number(helper.countPriceWithCouponAndDiscount(dishesPrice, serviceProps)),
                  serviceProps.integralsInfo.integralsDetail
                ).commutation}
              </span>
              <span className="order-integral">
                {helper.countIntegralsToCash(
                  Number(helper.countPriceWithCouponAndDiscount(dishesPrice, serviceProps)),
                  serviceProps.integralsInfo.integralsDetail
                ).integralInUsed}
              </span>
            </p>
            :
            false
          }
          {commercialProps.carryRuleVO && helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange > 0 ?
            <p className="order-summary-entry clearfix">
              <span className="option-title option-title--icon order-summary-icon5">自动抹零:</span>
              <span className="order-discount discount">
                {Math.abs(helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange)}
              </span>
            </p>
            :
            false
          }
        </div>
        <div className="option order-total clearfix">
          <div className="order-total-left">
            <span className="text-dove-grey">总计: </span>
            <span className="price">{
              helper.countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
            }</span>
          </div>
          {commercialProps.carryRuleVO ?
            <div>
              <div className="order-total-left">
                <span className="text-dove-grey">优惠: </span>
                <span className="price">
                  {
                    helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)
                  }
                </span>
              </div>
              <div className="order-total-right">
                <span className="text-dove-grey">实付: </span>
                <span className="price">
                  {
                    helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
                  }
                </span>
              </div>
            </div>
            :
            false
          }
        </div>
      </div>
    );
  },
});
