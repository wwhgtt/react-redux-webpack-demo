const _find = require('lodash.find');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;

exports.isPaymentAvaliable = function (payment, diningForm, isPickupFromFrontDesk, pickupPayType, totablePayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  return isPickupFromFrontDesk ? pickupPayType.indexOf(payment) : totablePayType.indexOf(payment);
};
exports.shouldPaymentAutoChecked = function (payment, isPickupFromFrontDesk, pickupPayType, totablePayType) {
  if (isPickupFromFrontDesk) {
    return pickupPayType.indexOf(',') !== -1 ? payment === pickupPayType.split(',')[0] : payment === pickupPayType;
  }
  return totablePayType.indexOf(',') !== -1 ? payment === totablePayType.split(',')[0] : payment === totablePayType;
};
exports.getSelectedTable = function (tableProps) {
  return {
    area: _find(tableProps.areas, { isChecked:true }),
    table: _find(tableProps.tables, { isChecked:true }),
  };
};
exports.countPriceByCoupons = function (coupon, totalPrice) {
  let remission = '';
  if (coupon.couponType === 1) {
    // '满减券'
    return remission = coupon.coupRuleBeanList[0].ruleValue;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return remission = totalPrice * Number(coupon.coupRuleBeanList[0].ruleValue);
  } else if (coupon.couponType === 3) {
    // '礼品券';
    return remission;
  } else if (coupon.couponType === 4) {
    // '现金券';
    return remission = coupon.coupRuleBeanList[0].ruleValue;
  }
  return true;
};
const countIntegralsToCash = exports.countIntegralsToCash = function (totalPrice, remission, integralsInfo) {
  if (!remission) {
    remission = 0;
  }
  const canBeUsedCommutation = totalPrice - remission;
  let limitType = integralsInfo.limitType;
  if (limitType === 1) {
    return {
      commutation:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
        integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
        :
        canBeUsedCommutation,
      integralInUsed:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
        integralsInfo.integral
        :
        canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    };
  } else if (limitType === 2) {
    return integralsInfo.limitIntegral < integralsInfo.integral ?
    {
      commutation:integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
          :
          canBeUsedCommutation,
      integralInUsed:integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.limitIntegral
          :
          canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    }
      :
    {
      commutation:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
          :
          canBeUsedCommutation,
      integralInUsed:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.integral
          :
          canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    };
  }
  return false;
};
const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, totalPrice) {
  const { transferType, scale } = carryRuleVO;
  if (transferType === 1) {
    // 四舍五入
    return Math.abs(totalPrice - totalPrice.toFixed(scale)).toFixed(scale);
  } else if (transferType === 2) {
    // 无条件进位
    return Math.ceil(totalPrice) - totalPrice;
  } else if (transferType === 3) {
    // 无条件舍去
    return totalPrice - Math.floor(totalPrice);
  }
  return false;
};
// 计算优惠价格
const countDecreasePrice = exports.countDecreasePrice = function (orderedDishesProps, orderSummary, integralsInfo, commercialProps) {
  if (integralsInfo.isChecked && commercialProps.carryRuleVO) {
    return Number(countIntegralsToCash(
                    getDishesPrice(orderedDishesProps.dishes),
                    orderSummary.coupon,
                    integralsInfo.integralsDetail
                  ).commutation
          ) + Number(
            clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
          )
          + Number(orderSummary.coupon);
  } else if (!integralsInfo.isChecked && commercialProps.carryRuleVO) {
    return Number(
              clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
           )
           + Number(orderSummary.coupon);
  }
  return false;
};
// 计算优惠后的价格
exports.countFinalPrice = function (orderedDishesProps, orderSummary, integralsInfo, commercialProps) {
  return Number(getDishesPrice(orderedDishesProps.dishes))
        - Number(countDecreasePrice(orderedDishesProps, orderSummary, integralsInfo, commercialProps));
};
