const _find = require('lodash.find');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;
const getDishesCount = require('../helper/dish-hepler.js').getDishesCount;
const getUrlParam = require('../helper/dish-hepler.js').getUrlParam;
exports.isPaymentAvaliable = function (payment, diningForm, isPickupFromFrontDesk, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  return isPickupFromFrontDesk ? selfPayType.indexOf(payment) : sendPayType.indexOf(payment);
};
exports.shouldPaymentAutoChecked = function (payment, isPickupFromFrontDesk, selfPayType, sendPayType) {
  if (isPickupFromFrontDesk) {
    return selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
  }
  return sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
};
const getDishBoxPrice = exports.getDishBoxPrice = function () {
  const dishBoxPrice = localStorage.getItem('dishBoxPrice');
  if (!dishBoxPrice || dishBoxPrice === 0) {
    return false;
  }
  return parseFloat(dishBoxPrice);
};
exports.getSelectedTable = function (tableProps) {
  return {
    area:_find(tableProps.areas, { isChecked:true }),
    table: _find(tableProps.tables, { isChecked:true }),
  };
};
exports.initializeAreaAdnTableProps = function (areaList, tableList) {
  if (!areaList || !tableList) {
    return {
      areaList:null,
      tableList:null,
      isEditable:false,
    };
  }
  const tableId = getUrlParam('tableId');
  if (!tableId) {
    tableList.forEach(table => table.id = parseInt(table.tableID, 10));
    return {
      areaList,
      tableList,
      isEditable:true,
    };
  }
  tableList.forEach(
    table => table.synFlag === tableId ?
      (_find(areaList, { id:table.areaId }).isChecked = true, table.isChecked = true)
      :
      false
  );
  if (_find(tableList, { isChecked:true }) !== undefined) {
    tableList.forEach(table => table.id = parseInt(table.tableID, 10));
    return {
      areaList,
      tableList,
      isEditable:false,
    };
  }
  return {
    areaList:null,
    tableList:null,
    isEditable:false,
  };
};
// 计算配送费
const countDeliveryPrice = exports.countDeliveryPrice = function (deliveryProps) {
  if (getUrlParam('type') === 'TS') {
    return false;
  }
  if (!deliveryProps || !deliveryProps.deliveryPrice) {
    return false;
  }
  return deliveryProps.deliveryPrice;
};
const countDeliveryRemission = exports.countDeliveryRemission = function (dishesPrice, deliveryProps) {
  if (getUrlParam('type') === 'TS') {
    return false;
  }
  if (!deliveryProps || !deliveryProps.freeDeliveryPrice || !deliveryProps.deliveryPrice) {
    return false;
  }
  if (dishesPrice >= deliveryProps.freeDeliveryPrice) {
    return deliveryProps.deliveryPrice;
  }
  return false;
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
  if (canBeUsedCommutation <= 0 || !integralsInfo) {
    return {
      commutation:0,
      integralInUsed:0,
    };
  }
  let limitType = integralsInfo.limitType;
  // 取余数  向下取整
  const canUsesIntegralTimes = Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue);
  console.log(canUsesIntegralTimes);
  if (limitType === 1) {
    const integralInUsed = canUsesIntegralTimes * integralsInfo.exchangeIntegralValue < integralsInfo.integral ?
      canUsesIntegralTimes * integralsInfo.exchangeIntegralValue
      :
      Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue;
    return {
      commutation:integralInUsed / integralsInfo.exchangeIntegralValue * integralsInfo.exchangeCashValue,
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
  totalPrice = Number(totalPrice) + getDishBoxPrice() +
  Number(countDeliveryPrice(serviceProps.deliveryProps)) -
  Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps));
  if (transferType === 1) {
    // 四舍五入
    return {
      smallChange:parseFloat(Math.abs(totalPrice - parseFloat(totalPrice.toFixed(scale))).toFixed(2)),
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
      return totalPrice.toString().indexOf('.') !== -1 ?
      {
        smallChange:totalPrice.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((parseFloat((Math.ceil(totalPrice * 10 + 1) / 10).toFixed(2)) - totalPrice).toFixed(2)),
        priceWithClearSmallChange:totalPrice.toString().split('.')[1].length === 1 ?
        totalPrice
        :
        parseFloat((Math.ceil(totalPrice * 10 + 1) / 10).toFixed(2)),
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
      return totalPrice.toString().indexOf('.') !== -1 ?
      {
        smallChange:totalPrice.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((totalPrice - parseFloat((Math.floor(totalPrice * 10) / 10).toFixed(2))).toFixed(2)),
        priceWithClearSmallChange:totalPrice.toString().split('.')[1].length === 1 ?
        totalPrice
        :
        parseFloat((Math.floor(totalPrice * 10) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:totalPrice,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((totalPrice - Math.floor(totalPrice)).toFixed(2)),
        priceWithClearSmallChange:Math.floor(totalPrice),
      };
    }
  }
  return false;
};
// 计算优惠价格;
exports.countDecreasePrice = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  if (serviceProps.integralsInfo && serviceProps.integralsInfo.isChecked) {
    return serviceProps.couponsProps.inUseCoupon ?
      Number(countIntegralsToCash(
              clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).priceWithClearSmallChange,
                serviceProps.integralsInfo.integralsDetail
              ).commutation
      ) + Number(countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, dishesPrice))
      + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps))
      :
      Number(countIntegralsToCash(
                clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps).priceWithClearSmallChange,
                serviceProps.integralsInfo.integralsDetail
              ).commutation
      ) + Number(serviceProps.discountProps.inUseDiscount)
       + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps));
  }
  return serviceProps.couponsProps.inUseCoupon ?
    Number(countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, dishesPrice))
    + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps))
     :
    Number(serviceProps.discountProps.inUseDiscount) + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps));
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
              disCountPriceList.push(
                parseFloat(((1 - parseFloat(dishcount.value) / 10) * getDishesCount([orderedDish]) * orderedDish.marketPrice).toFixed(2))
              );
            }
          }
        );
      }
    );
  } else if (discountType === 2) {
    // 表示会员价格
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(
                parseFloat((dishcount.value * getDishesCount([orderedDish])).toFixed(2))
              );
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
  const integralsToCash = serviceProps.integralsInfo.isChecked ?
    countIntegralsToCash(
      clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes), serviceProps).priceWithClearSmallChange,
      serviceProps.integralsInfo.integralsDetail
    ).commutation
    :
    0;
  return (parseFloat(clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes), serviceProps).priceWithClearSmallChange)
      - parseFloat(integralsToCash)).toFixed(2);
};
exports.getSubmitUrlParams = function (state, note, receipt) {
  const payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  const integral = state.integralsInfo ? countIntegralsToCash(clearSmallChange(
    state.commercialProps.carryRuleVO,
    getDishesPrice(state.orderedDishesProps.dishes),
    state.serviceProps).priceWithClearSmallChange,
    state.serviceProps.integralsInfo.integralsDetail
  ).integralInUsed : false;
  const needPayPrice = countFinalPrice(
    state.orderedDishesProps, state.serviceProps, state.commercialProps
  );
  const type = getUrlParam('type');
  const useDiscount = !state.serviceProps.discountProps.inUseDiscount ? '0' : '1';
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCouponDetail.id ? state.serviceProps.couponsProps.inUseCouponDetail.id : '0';
  let tableId;
  if (type === 'TS' && serviceApproach === 'totable' && state.tableProps.tables && state.tableProps.tables.length) {
    if (state.tableProps.tables.filter(table => table.isChecked).length === 0) {
      return { success:false, msg:'未选择桌台信息' };
    }
    tableId = state.tableProps.tables.filter(table => table.isChecked)[0].id;
  } else {
    tableId = 0;
  }
  let params;
  if (type === 'WM') {
    const selectedAddress = state.customerProps.addresses !== null && state.customerProps.addresses.length !== 0 ?
          state.customerProps.addresses.filter(address => address.isChecked)[0].address
          :
          0;
    const selectedAddressId = state.customerProps.addresses !== null && state.customerProps.addresses.length !== 0 ?
          state.customerProps.addresses.filter(address => address.isChecked)[0].id
          :
          0;
    const toShopFlag = state.serviceProps.sendAreaId === 0 ? '1' : '0';
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&note=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + state.customerProps.sex
        + '&payMethod=' + payMethodScope
        + '&coupId=' + coupId
        + '&integral=' + Number(integral)
        + '&useDiscount=' + useDiscount
        + '&orderType=WM'
        + '&peopleCount=' + state.customerProps.customerCount
        + '&shopId=' + getUrlParam('shopId')
        + '&needPayPrice=' + needPayPrice
        + '&time=' + state.timeProps.selectedDateTime.date + '%20' + (state.timeProps.selectedDateTime.time || '')
        + '&address=' + selectedAddress
        + '&memberAddressId=' + selectedAddressId
        + '&sendAreaId=' + state.serviceProps.sendAreaId
        + '&toShopFlag=' + toShopFlag;
  } else {
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&note=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + state.customerProps.sex
        + '&payMethod=' + payMethodScope
        + '&coupId=' + coupId
        + '&integral=' + Number(integral)
        + '&useDiscount=' + useDiscount
        + '&orderType=TS'
        + '&tableId=' + tableId
        + '&peopleCount=' + state.customerProps.customerCount
        + '&serviceApproach=' + serviceApproach
        + '&shopId=' + getUrlParam('shopId')
        + '&needPayPrice=' + needPayPrice;
  }
  return { success:true, params };
};

exports.initializeTimeTable = times => {
  if (!times || typeof times !== 'object') {
    return times;
  }

  const todayTime = times[new Date().toISOString().substr(0, 10)];
  if (todayTime && todayTime.length) {
    todayTime.unshift(0);
  }
  return times;
};
