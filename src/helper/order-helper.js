const _find = require('lodash.find');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;
const getDishPrice = require('../helper/dish-hepler.js').getDishPrice;
const getDishesCount = require('../helper/dish-hepler.js').getDishesCount;
const getUrlParam = require('../helper/dish-hepler.js').getUrlParam;
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
// 计算优惠券多少价格
const countPriceByCoupons = exports.countPriceByCoupons = function (coupon, totalPrice) {
  if (coupon.couponType === 1) {
    // '满减券'
    return coupon.coupRuleBeanList[0].ruleValue;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return totalPrice * (1 - Number(coupon.coupRuleBeanList[0].ruleValue));
  } else if (coupon.couponType === 3) {
    // '礼品券';
    return 0;
  } else if (coupon.couponType === 4) {
    // '现金券';
    return coupon.coupRuleBeanList[0].ruleValue;
  }
  return true;
};
const countIntegralsToCash = exports.countIntegralsToCash = function (canBeUsedCommutation, integralsInfo) {
  let limitType = integralsInfo.limitType;
  // 取余数  向下取整
  const canUsesIntegralTimes = Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue);
  if (limitType === 1) {
    const integralInUsed = canUsesIntegralTimes * integralsInfo.exchangeIntegralValue < integralsInfo.integral ?
      canUsesIntegralTimes * integralsInfo.exchangeIntegralValue
      :
      Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue;
    return {
      commutation:integralInUsed / integralsInfo.exchangeIntegralValue,
      integralInUsed,
    };
  } else if (limitType === 2) {
    if (integralsInfo.integral > integralsInfo.limitIntegral) {
      const moneyLimit = Math.floor(integralsInfo.limitIntegral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeCashValue;
      return {
        commutation:moneyLimit > canBeUsedCommutation ?
          Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeCashValue
          :
          moneyLimit,
        integralInUsed:moneyLimit > canBeUsedCommutation ?
          Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeIntegralValue
          :
          Math.floor(integralsInfo.limitIntegral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue,
      };
    }
    const noLimitMoney = Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeCashValue;
    return {
      commutation:noLimitMoney > canBeUsedCommutation ?
        Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeCashValue
        :
        noLimitMoney,
      integralInUsed:noLimitMoney > canBeUsedCommutation ?
        Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeIntegralValue
        :
         Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue,
    };
  }
  return false;
};
//  自动抹零
const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, dishesPrice, serviceProps) {
  const { transferType, scale } = carryRuleVO;
  let totalPrice = '';
  if (!serviceProps.couponsProps.inUseCoupon && !serviceProps.discountProps.inUseDiscount) {
    // 即没有使用任何优惠
    totalPrice = parseFloat(dishesPrice.toFixed(2));
  } else if (serviceProps.couponsProps.inUseCoupon) {
    totalPrice = parseFloat((dishesPrice - countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, dishesPrice)).toFixed(2));
  } else if (serviceProps.discountProps.inUseDiscount) {
    totalPrice = parseFloat((dishesPrice - serviceProps.discountProps.inUseDiscount).toFixed(2));
  } else {
    return false;
  }
  totalPrice = Number(totalPrice);
  if (transferType === 1) {
    // 四舍五入
    return {
      smallChange:parseFloat(Math.abs(totalPrice - parseFloat(totalPrice.toFixed(scale))).toFixed(scale)),
      priceWithClearSmallChange:parseFloat(
        (totalPrice - parseFloat(Math.abs(totalPrice - parseFloat(totalPrice.toFixed(scale))).toFixed(scale))).toFixed(scale)
      ),
    };
  } else if (transferType === 2) {
    // 无条件进位
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:totalPrice,
      };
    } else if (scale === 1) {
      return totalPrice.toString().length === 4 ?
      {
        smallChange:parseFloat((Number(totalPrice.toString().substr(-2)) + 0.1 - totalPrice).toFixed(1)),
        priceWithClearSmallChange:Number(totalPrice.toString().substr(-2)) + 0.1,
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:totalPrice,
      };
    } else if (scale === 0) {
      return {
        smallChange:Math.ceil(totalPrice) - totalPrice,
        priceWithClearSmallChange:Math.ceil(totalPrice),
      };
    }
  } else if (transferType === 3) {
    // 无条件舍去
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:totalPrice,
      };
    } else if (scale === 1) {
      return totalPrice.toString().length === 4 ?
      {
        smallChange:parseFloat((totalPrice - parseFloat(totalPrice.toString().substr(-2))).toFixed(2)),
        priceWithClearSmallChange:parseFloat(totalPrice.toString().substr(-2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:totalPrice,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((totalPrice - Math.floor(totalPrice)).toFixed(0)),
        priceWithClearSmallChange:Math.floor(totalPrice),
      };
    }
  }
  return false;
};
// 计算优惠价格;
const countDecreasePrice = exports.countDecreasePrice = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  if (serviceProps.integralsInfo && serviceProps.integralsInfo.isChecked) {
    return serviceProps.couponsProps.inUseCoupon ?
      Number(countIntegralsToCash(
              clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).priceWithClearSmallChange,
                serviceProps.integralsInfo.integralsDetail
              ).commutation
      ) + Number(countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, dishesPrice))
      :
      Number(countIntegralsToCash(
                clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).priceWithClearSmallChange,
                serviceProps.integralsInfo.integralsDetail
              ).commutation
      ) + Number(serviceProps.discountProps.inUseDiscount);
  }
  return serviceProps.couponsProps.inUseCoupon ?
    Number(countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, dishesPrice))
     :
    Number(serviceProps.discountProps.inUseDiscount);
};
// 计算会员价格
exports.countMemberPrice = function (isDiscountChecked, orderedDishes, memberDishesProps) {
  if (isDiscountChecked) {
    return false;
  }
  const discountType = memberDishesProps.discountType;
  const disCountPriceList = [];
  if (discountType === 1) {
    // 表示会员折扣
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(dishcount.value * getDishPrice(orderedDish));
            }
          }
        );
      }
    );
  } else if (discountType === 1) {
    // 表示会员价格
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(dishcount.value * getDishesCount([orderedDish]));
            }
          }
        );
      }
    );
  }
  return disCountPriceList.reduce((p, c) => p + c, 0);
};
// 计算优惠后的价格
const countFinalPrice = exports.countFinalPrice = function (orderedDishesProps, serviceProps, commercialProps) {
  return (parseFloat(getDishesPrice(orderedDishesProps.dishes))
      - parseFloat(countDecreasePrice(orderedDishesProps, serviceProps, commercialProps))).toFixed(2);
};
exports.getSubmitUrlParams = function (state, note, receipt) {
  const payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  const integral = countIntegralsToCash(clearSmallChange(
    state.commercialProps.carryRuleVO,
    getDishesPrice(state.orderedDishesProps.dishes),
    state.serviceProps).priceWithClearSmallChange,
    state.serviceProps.integralsInfo.integralsDetail
  ).integralInUsed;
  const needPayPrice = countFinalPrice(
    state.orderedDishesProps, state.serviceProps, state.commercialProps
  );
  const useDiscount = !state.serviceProps.discountProps.inUseDiscount ? '0' : '1';
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCouponDetail.id ? state.serviceProps.couponsProps.inUseCouponDetail.id : '0';
  let tableId;
  if (serviceApproach === 'totable' && state.tableProps.tables && state.tableProps.tables.length) {
    if (!state.tableProps.tables.filter(table => table.isChecked)) {
      throw new Error('未选择桌台信息');
    } else {
      tableId = state.tableProps.tables.filter(table => table.isChecked)[0].id;
    }
  } else {
    tableId = 0;
  }
  const params = '?name=' + state.customerProps.name
      + '&Invoice=' + receipt + '&note=' + note
      + '&mobile=' + state.customerProps.mobile
      + '&sex=' + state.customerProps.sex
      + '&payMethod=' + payMethodScope
      + '&coupId=' + coupId
      + '&integral=' + Number(integral)
      + '&useDiscount=' + useDiscount
      + '&orderType=' + getUrlParam('type')
      + '&tableId=' + tableId
      + '&peopleCount=' + state.customerProps.customerCount
      + '&serviceApproach=' + serviceApproach
      + '&shopId=' + getUrlParam('shopId')
      + '&needPayPrice=' + needPayPrice;
  return params;
};
