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
  render() {
    const { serviceProps, commercialProps, orderedDishesProps, shopId } = this.props;
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
                {serviceProps.couponsProps.inUseCoupon ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">优惠券优惠:</span>
                    <span className="order-discount discount">
                      {
                        helper.countPriceByCoupons(
                          serviceProps.couponsProps.inUseCouponDetail,
                          getDishesPrice(orderedDishesProps.dishes)
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
                          getDishesPrice(orderedDishesProps.dishes),
                          serviceProps).priceWithClearSmallChange,
                        serviceProps.integralsInfo.integralsDetail
                      ).commutation}
                    </span>
                    <span className="order-integral">
                      {helper.countIntegralsToCash(
                        helper.clearSmallChange(
                          commercialProps.carryRuleVO,
                          getDishesPrice(orderedDishesProps.dishes),
                          serviceProps).priceWithClearSmallChange,
                        serviceProps.integralsInfo.integralsDetail
                      ).integralInUsed}
                    </span>
                  </p>
                  :
                  false
                }
                {commercialProps.carryRuleVO &&
                  helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes), serviceProps).smallChange !== 0 ?
                  <p className="order-summary-entry clearfix">
                    <span className="order-title">自动抹零:</span>
                    <span className="order-discount discount">
                      {
                        helper.clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes), serviceProps).smallChange
                      }
                    </span>
                  </p>
                  :
                  false
                }
              </div>
              <div className="order-prop-option order-total clearfix">
                <div className="order-total-left">
                  <span className="text-dove-grey">总计: </span>
                  <span className="price">{getDishesPrice(orderedDishesProps.dishes)}</span>
                </div>
                {commercialProps.carryRuleVO ?
                  <div>
                    <div className="order-total-left">
                      <span className="text-dove-grey">优惠: </span>
                      <span className="price">
                        {helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)}
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
