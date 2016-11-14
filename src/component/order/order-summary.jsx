const React = require('react');
const _find = require('lodash.find');
const ActiveSelect = require('../mui/select/active-select.jsx');
const OrderPropOption = require('./order-prop-option.jsx');
const helper = require('../../helper/order-helper.js');
const OrderedDish = require('./ordered-dish.jsx');
const getDishesPrice = require('../../helper/dish-hepler.js').getDishesPrice;
const isSingleDishWithoutProps = require('../../helper/dish-hepler.js').isSingleDishWithoutProps;
const getDishesCount = require('../../helper/dish-hepler.js').getDishesCount;
const formatPrice = require('../../helper/common-helper.js').formatPrice;
const classnames = require('classnames');
require('./order-summary.scss');

module.exports = React.createClass({
  displayName: 'OrderSummary',
  propTypes: {
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
    orderedDishesProps:React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]).isRequired,
    shopId:React.PropTypes.string.isRequired,
    isNeedShopMaterial:React.PropTypes.bool.isRequired,
    onSelectBenefit:React.PropTypes.func,
    setOrderProps:React.PropTypes.func,
  },
  componentDidMount() {

  },
  buildOrderedElements(orderedDishes) {
    const { serviceProps } = this.props;
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
              { order:[Object.assign({}, dishOrder)] },
              { orderLength:dish.order.length }
            )
          );
        })
      );
    }
    const dividedDishes = divideDishes(orderedDishes);
    return dividedDishes.map(
      dish => (<OrderedDish key={dish.key} dish={dish} onSelectBenefit={this.props.onSelectBenefit} serviceProps={serviceProps} />)
    );
  },
  render() {
    const { serviceProps, commercialProps, orderedDishesProps, isNeedShopMaterial, setOrderProps } = this.props;
    const dishesPrice = orderedDishesProps.dishes && orderedDishesProps.dishes.length ? getDishesPrice(orderedDishesProps.dishes) : 0;
    if (!orderedDishesProps.dishes || !orderedDishesProps.dishes.length) return false;

    let hasPriviledge = false;
    if (commercialProps.hasOwnProperty) {
      hasPriviledge = commercialProps.hasPriviledge;
    }
    const orderedElements = this.buildOrderedElements(orderedDishesProps.dishes);
    return (
      <div className="order-summary-cart">
        <div className="options-group division-group">
          {isNeedShopMaterial ?
            <div className="option option-shop">
              <p className="option-shop-desc ellipsis">{commercialProps.name}</p>
              <div className="clearfix"></div>
              <p className="dish-detail">
                <span className="dish-detail-left">已选菜品</span>
                <span className="dish-detail-middle">共{getDishesCount(orderedDishesProps.dishes)}份</span>
                <span className="dish-detail-right"><a href={helper.getMoreDishesUrl()}>继续点菜</a></span>
              </p>
            </div>
            :
            false
          }
          <div className="ordered-dish-content">
            {orderedElements}
          </div>
          <div className="extraPrice clearfix">
            {serviceProps.deliveryProps && serviceProps.deliveryProps.deliveryPrice ?
              <p className="option clearfix ">
                <span className="option-title">配送费</span>
                <span className="order-discount price">{serviceProps.deliveryProps.deliveryPrice}</span>
              </p>
              :
              false
            }
            {helper.getDishBoxPrice() ?
              <p className="option clearfix">
                <span className="option-title">餐盒费</span>
                <span className="order-discount price">{helper.getDishBoxPrice()}</span>
              </p>
              :
              false
            }
            {serviceProps.benefitProps && serviceProps.benefitProps.extraPrivilege && serviceProps.benefitProps.extraPrivilege.length ?
              <p className="option clearfix">
                <span className="option-title">附加费</span>
                <span className="order-discount price">
                  {formatPrice(helper.countExtraPrivilege(serviceProps.benefitProps.extraPrivilege))}
                </span>
              </p>
              :
              false
            }
            {commercialProps.carryRuleVO && helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange < 0 ?
              <p className="option clearfix">
                <span className="option-title">尾数调整</span>
                <span className="order-discount price">
                  {Math.abs(helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange)}
                </span>
              </p>
              :
              false
            }
          </div>
          <div
            className={
              classnames('benefit-options', {
                'benefit-none': !serviceProps.couponsProps.couponsList && !serviceProps.integralsInfo || hasPriviledge,
              })
            }
          >
            {serviceProps.couponsProps.couponsList && serviceProps.couponsProps.couponsList.length
              && helper.getCouponsLength(serviceProps.couponsProps.couponsList) !== 0 ?
              <a
                className={classnames('option', 'division', { 'only-coupon':!serviceProps.integralsInfo || serviceProps.diningForm === 0 })}
                href="#coupon-select"
              >
                <span className="option-title temporary-coupon">使用优惠券</span>
                <span className="badge-coupon">
                  {serviceProps.couponsProps.inUseCoupon ?
                    '已使用一张优惠券'
                    :
                    `${helper.getCouponsLength(serviceProps.couponsProps.couponsList)}张可用`
                  }
                </span>
                <span className="option-btn btn-arrow-right">{serviceProps.couponsProps.inUseCoupon ? false : '未使用'}</span>
              </a>
            : false}
            {serviceProps.integralsInfo && serviceProps.diningForm !== 0 ?
              <ActiveSelect
                optionsData={[serviceProps.integralsInfo]} onSelectOption={setOrderProps}
                optionComponent={OrderPropOption}
              />
            : false}
          </div>
          <div className="options-group extra-bottom">
            <div className="order-summary">
              {serviceProps.discountProps.inUseDiscount ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon1">会员优惠</span>
                  <span className="order-discount discount">
                    {serviceProps.discountProps.inUseDiscount}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.activityBenefit.benefitMoney > 0 ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon6">活动优惠</span>
                  <span className="order-discount discount">
                    {serviceProps.activityBenefit.benefitMoney}
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
                  <span className="option-title option-title--icon order-summary-icon3">优惠券优惠</span>
                  <span className="order-discount discount">
                    {serviceProps.discountProps.discountInfo && serviceProps.discountProps.discountInfo.isChecked ?
                      formatPrice(
                        helper.countPriceByCoupons(
                          serviceProps.couponsProps.inUseCouponDetail,
                          helper.getPriceCanBeUsedToBenefit(dishesPrice, serviceProps.deliveryProps)
                            - serviceProps.discountProps.inUseDiscount - serviceProps.activityBenefit.benefitMoney
                        )
                      )
                      :
                      formatPrice(
                        helper.countPriceByCoupons(
                          serviceProps.couponsProps.inUseCouponDetail,
                          helper.getPriceCanBeUsedToBenefit(dishesPrice, serviceProps.deliveryProps)
                            - serviceProps.activityBenefit.benefitMoney
                        )
                      )
                    }
                  </span>
                </p>
                :
                false
              }

              {serviceProps.integralsInfo && serviceProps.integralsInfo.isChecked && commercialProps.carryRuleVO ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon4">积分抵扣</span>
                  <span className="order-discount discount">
                    {helper.countIntegralsToCash(
                      Number(helper.countPriceWithCouponAndDiscount(dishesPrice, serviceProps)),
                      serviceProps.integralsDetail
                    ).commutation}
                  </span>
                  <span className="order-integral">
                    {helper.countIntegralsToCash(
                      Number(helper.countPriceWithCouponAndDiscount(dishesPrice, serviceProps)),
                      serviceProps.integralsDetail
                    ).integralInUsed}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.benefitProps && _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 6) ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon1">会员优惠</span>
                  <span className="order-discount discount">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 6).privilegeAmount}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.benefitProps && _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 4) ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon3">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 4).privilegeName}:
                  </span>
                  <span className="order-discount discount">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 4).privilegeAmount}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.benefitProps && _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 5) ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon4">积分抵扣</span>
                  <span className="order-discount discount">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 5).privilegeAmount}
                  </span>
                  <span className="order-integral">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === 5).privilegeValue}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.benefitProps && _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === -101) ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon7">{
                    `礼品券-赠送${
                      _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === -101).privilegeName
                    }`
                  }:</span>
                  <span className="order-discount discount">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === -101).privilegeAmount}
                  </span>
                </p>
                :
                false
              }
              {serviceProps.benefitProps && _find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === -100) ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon7">其他优惠</span>
                  <span className="order-discount discount">
                    {_find(serviceProps.benefitProps.benefitList, benefit => benefit.privilegeType === -100).privilegeAmount}
                  </span>
                </p>
                :
                false
              }
              {commercialProps.carryRuleVO && helper.clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).smallChange > 0 ?
                <p className="order-summary-entry clearfix">
                  <span className="option-title option-title--icon order-summary-icon5">自动抹零</span>
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
                <span className="text-dove-grey">原价 </span>
                <span className="price">{serviceProps.benefitProps && serviceProps.benefitProps.isPriviledge ?
                  formatPrice(
                    serviceProps.benefitProps.extraPrice
                      + helper.countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
                  )
                  :
                  formatPrice(
                    helper.countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
                  )
                }</span>
              </div>
              {commercialProps.carryRuleVO ?
                <div>
                  <div className="order-total-left">
                    <span className="text-dove-grey">优惠 </span>
                    <span className="price">
                      {serviceProps.benefitProps && serviceProps.benefitProps.isPriviledge ?
                        serviceProps.benefitProps.priviledgeAmount
                        :
                        formatPrice(
                          helper.countDecreasePrice(orderedDishesProps, serviceProps, commercialProps)
                        )
                      }
                    </span>
                  </div>
                  <div className="order-total-right">
                    <span className="text-dove-grey">总计 </span>
                    <span className="price">
                      {serviceProps.benefitProps && serviceProps.benefitProps.isPriviledge ?
                        serviceProps.benefitProps.totalAmount
                        :
                        formatPrice(
                          helper.countFinalNeedPayMoney(orderedDishesProps, serviceProps, commercialProps)
                        )
                      }
                    </span>
                  </div>
                </div>
                :
                false
              }
            </div>
          </div>
        </div>
      </div>
    );
  },
});
