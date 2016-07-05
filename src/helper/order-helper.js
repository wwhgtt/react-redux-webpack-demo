const _find = require('lodash.find');

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
exports.countIntegralsToCash = function (totalPrice, remission, integralsInfo) {
  let limitType = integralsInfo.limitType;
  if (limitType === 1) {
    return integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue;
  } else if (limitType === 2) {
    return integralsInfo.limitIntegral <= integralsInfo.integral ?
      integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
      :
      integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue;
  }
  return false;
};
exports.clearSmallChange = function (carryRuleVO, totalPrice) {
  let transferType = carryRuleVO.transferType;
  if (transferType === 1) {
    // 四舍五入
    return totalPrice - Math.round(totalPrice);
  } else if (transferType === 2) {
    // 无条件进位
    return Math.ceil(totalPrice) - totalPrice;
  } else if (transferType === 3) {
    // 无条件舍去
    return totalPrice - Math.floor(totalPrice);
  }
  return false;
};
