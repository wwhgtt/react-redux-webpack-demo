const _find = require('lodash.find');
const _has = require('lodash.has');
const Immutable = require('seamless-immutable');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;
const getDishesCount = require('../helper/dish-hepler.js').getDishesCount;
const getUrlParam = require('../helper/dish-hepler.js').getUrlParam;
const isSingleDishWithoutProps = require('../helper/dish-hepler.js').isSingleDishWithoutProps;
const getDishPrice = require('../helper/dish-hepler.js').getDishPrice;
const getOrderPrice = require('../helper/dish-hepler.js').getOrderPrice;
const replaceEmojiWith = require('../helper/common-helper.js').replaceEmojiWith;
const dateUtility = require('../helper/common-helper.js').dateUtility;
const config = require('../config.js');
// 判断一个对象是否为空
exports.isEmptyObject = (obj) => {
  for (let n in obj) { console.log(n); return false; }
  return true;
};
// 判断默认应该选中的配送时间
exports.getDefaultSelectedDateTime = (timeTable, defaultSelectedDateTime) => {
  const selectedDateTime = { date: '', time: '' };
  if (!timeTable) {
    return selectedDateTime;
  }

  if (defaultSelectedDateTime) {
    const times = timeTable[defaultSelectedDateTime.date];
    if (times && times.indexOf(defaultSelectedDateTime.time) !== -1) {
      return Object.assign(selectedDateTime, defaultSelectedDateTime);
    }
  }
  const todayStr = dateUtility.format(new Date());
  let defaultDate = '';
  for (const key in timeTable) {
    if (!timeTable.hasOwnProperty(key)) {
      continue;
    }

    const firstValue = timeTable[key] && timeTable[key][0];
    const isToday = todayStr === key;
    if (!defaultDate || isToday) {
      selectedDateTime.date = defaultDate = key;
      selectedDateTime.time = firstValue;
      if (isToday) {
        break;
      }
    }
  }
  return selectedDateTime;
};
// 获取加菜的URL
exports.getMoreDishesUrl = function () {
  const type = getUrlParam('type');
  const shopId = getUrlParam('shopId');
  const tableId = getUrlParam('tableId');
  const initializeUrl = type === 'TS' ?
      config.getMoreTSDishesURL + '?type=TS&shopId=' + shopId
      :
      config.getMoreWMDishesURL + '?type=WM&shopId=' + shopId;
  return !tableId ? initializeUrl : initializeUrl + '&tableId=' + tableId;
};
// 下单成功以后为后台设置一个callbackUrl
exports.setCallbackUrl = function (id) {
  const callbackUrlWithEncode = getUrlParam('type') === 'TS' ?
    encodeURIComponent(
      'http://' + location.host + '/order/orderallDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    )
    :
    encodeURIComponent(
      'http://' + location.host + '/order/takeOutDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    );
  sessionStorage.setItem('rurl_payDetaill', JSON.stringify(callbackUrlWithEncode));
};
// 初始化时间选择器
exports.initializeTimeTable = (times) => {
  if (!times || typeof times !== 'object') {
    return times;
  }

  const now = new Date();
  const todayTimes = times[dateUtility.format(now)];
  if (!todayTimes || !todayTimes.length) {
    return times;
  }
  const firstItem = todayTimes[0];
  if (['立即取餐', '立即送餐'].indexOf(firstItem) !== -1) {
    todayTimes[0] = 0;
  }
  return times;
};
// 判断支付方式是否可用
exports.isPaymentAvaliable = function (payment, diningForm, isPickupFromFrontDesk, sendAreaId, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline' ? 0 : -1;
  }
  if (getUrlParam('type') === 'WM') {
    return sendAreaId.toString() === '0' ? selfPayType.indexOf(payment) : sendPayType.indexOf(payment);
  }
  return isPickupFromFrontDesk ? selfPayType.indexOf(payment) : sendPayType.indexOf(payment);
};
// 判断支付方式是否应该checked
exports.shouldPaymentAutoChecked = function (payment, diningForm, isPickupFromFrontDesk, sendAreaId, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  if (getUrlParam('type') === 'WM') {
    if (sendAreaId.toString() === '0') {
      return selfPayType && selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
    }
    return selfPayType && sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
  }
  if (isPickupFromFrontDesk) {
    return selfPayType && selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
  }
  return selfPayType && sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
};
// 获取线下支付方式在不通场景中的名字
exports.getOfflinePaymentName = function (sendAreaId) {
  if (getUrlParam('type') === 'TS') {
    return '线下支付';
  }
  return sendAreaId === 0 ? '线下支付' : '货到付款';
};
// 获取被选中的桌台信息
exports.getSelectedTable = function (tableProps) {
  return {
    area:_find(tableProps.areas, { isChecked:true }),
    table: _find(tableProps.tables, { isChecked:true }),
  };
};
// 判断前台取餐是否应该自动选中
exports.isPickUpAutoChecked = function (serviceProps) {
  if (!serviceProps || serviceProps.indexOf('totable') !== -1) {
    return { name:'前台取餐', isChecked:false, id:'way-of-get-diner' };
  }
  return { name:'前台取餐', isChecked:true, id:'way-of-get-diner' };
};
// 初始化桌台信息
exports.initializeAreaAdnTableProps = function (areaList, tableList) {
  if (!areaList || !tableList || !areaList.length || !tableList.length) {
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
  // url中有传tableID且能找到的情况下  返回找到的tableID   如果没有找到的情况下返回的是
  // 空的areaList和tableList 这种情况会与后台没有返回数据的情况重合 前端无法判断  所以
  // 将这种情况下的isEditable设置为true  作为区分
  return {
    areaList:null,
    tableList:null,
    isEditable:true,
  };
};
// 从localStorage中获取餐盒费
const getDishBoxPrice = exports.getDishBoxPrice = function () {
  const dishBoxPrice = localStorage.getItem('dishBoxPrice');
  if (!dishBoxPrice || dishBoxPrice === 0) {
    return false;
  }
  return parseFloat(dishBoxPrice);
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
// 计算减免的配送费
const countDeliveryRemission = exports.countDeliveryRemission = function (dishesPrice, deliveryProps) {
  if (getUrlParam('type') === 'TS') {
    return false;
  }
  if (!deliveryProps || deliveryProps.freeDeliveryPrice < 0 || deliveryProps.deliveryPrice < 0) {
    return false;
  }
  if (dishesPrice >= deliveryProps.freeDeliveryPrice) {
    return deliveryProps.deliveryPrice;
  }
  return false;
};
// 计算进入页面时的总价
//  自动抹零现规则是在积分，优惠券，折扣换算完以后才执行
//  计算优惠券信息是countPriceByCoupons 折扣信息为serviceProps.discountProps.inUseDiscount,已经计算好了的
const countTotalPriceWithoutBenefit = exports.countTotalPriceWithoutBenefit = function (dishesPrice, deliveryProps) {
  //  计算菜品初始价格加配送费和配送费优惠
  return parseFloat((dishesPrice + getDishBoxPrice() + Number(countDeliveryPrice(deliveryProps))).toFixed(2));
};
// 计算会员价格 优惠了多少钱
exports.countMemberPrice = function (isDiscountChecked, orderedDishes, discountList, discountType) {
  if (!isDiscountChecked) {
    return false;
  }
  const disCountPriceList = [];
  let newOrderedDishes = orderedDishes.asMutable({ deep: true });
  for (let i = 0; i < newOrderedDishes.length; i++) {
    if (newOrderedDishes[i].isRelatedToCoupon) {
      let dishCount = getDishesCount([newOrderedDishes[i]]);
      if (dishCount <= newOrderedDishes[i].relatedCouponCount) {
        newOrderedDishes.splice(i, 1);
      } else {
        if (isSingleDishWithoutProps(newOrderedDishes[i])) {
          newOrderedDishes[i].order = dishCount - newOrderedDishes[i].relatedCouponCount;
        } else {
          const orderLength = newOrderedDishes[i].order.length;
          for (let j = 0; j < orderLength; j++) {
            if (newOrderedDishes[i].order[j].count <= newOrderedDishes[i].relatedCouponCount) {
              newOrderedDishes[i].relatedCouponCount = newOrderedDishes[i].relatedCouponCount - newOrderedDishes[i].order[j].count;
              newOrderedDishes[i].order[j].count = 0;
            } else {
              newOrderedDishes[i].order[j].count = newOrderedDishes[i].order[j].count - newOrderedDishes[i].relatedCouponCount;
            }
          }
        }
      }
    }
  }
  if (discountType === 1) {
    discountList.forEach(
      dishcount => {
        newOrderedDishes.filter(dish => !dish.noUseDiscount).forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              if (isSingleDishWithoutProps(orderedDish)) {
                disCountPriceList.push(parseFloat(
                  ((1 - parseFloat(dishcount.value) / 10) * getDishesCount([orderedDish]) * orderedDish.marketPrice).toFixed(2)
                ));
              } else {
                orderedDish.order.map(order => {
                  let orderPrice = getOrderPrice(orderedDish, order);
                  let discountPrice = parseFloat(
                    ((1 - parseFloat(dishcount.value) / 10) * order.count * orderedDish.marketPrice).toFixed(2)
                  );
                  if (orderPrice > discountPrice) {
                    disCountPriceList.push(discountPrice);
                  } else {
                    disCountPriceList.push(orderPrice);
                  }
                  return true;
                });
              }
            }
          }
        );
      }
    );
  } else if (discountType === 2) {
    // 表示会员价格
    discountList.forEach(
      dishcount => {
        newOrderedDishes.filter(dish => !dish.noUseDiscount).forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              if (isSingleDishWithoutProps(orderedDish)) {
                disCountPriceList.push(
                  parseFloat(((orderedDish.marketPrice - dishcount.value) * getDishesCount([orderedDish])).toFixed(2))
                );
              } else {
                orderedDish.order.map(order => {
                  let orderPrice = getOrderPrice(orderedDish, order);
                  let discountPrice = parseFloat(
                    ((orderedDish.marketPrice - dishcount.value) * order.count).toFixed(2)
                  );
                  if (orderPrice > discountPrice) {
                    disCountPriceList.push(discountPrice);
                  } else {
                    disCountPriceList.push(orderPrice);
                  }
                  return true;
                });
              }
            }
          }
        );
      }
    );
  }
  return parseFloat((disCountPriceList.reduce((p, c) => p + c, 0)).toFixed(2));
};
// 计算积分换算金额
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
// 获取关联菜品的礼品券可以省多少钱
const countRelatedDishGiftCouponPrice = function (dish, dishCount, dishPrice, relatedCouponDish, coupon, benefitMoneyCollection) {
  relatedCouponDish.name = dish.name;
  relatedCouponDish.number = coupon.num;
  if ((coupon.num - relatedCouponDish.joinBenefitDishesNumber) > 0) {
    if ((coupon.num - relatedCouponDish.joinBenefitDishesNumber) < dishCount) {
      benefitMoneyCollection.push(dish.marketPrice < dishPrice / dishCount ?
        dish.marketPrice * (coupon.num - relatedCouponDish.joinBenefitDishesNumber)
        :
        dishPrice / dishCount * (coupon.num - relatedCouponDish.joinBenefitDishesNumber)
      );
    } else {
      benefitMoneyCollection.push(dish.marketPrice < dishPrice / dishCount ?
        dish.marketPrice * dishCount
        :
        dishPrice
      );
    }
    relatedCouponDish.joinBenefitDishesNumber = (coupon.num - relatedCouponDish.joinBenefitDishesNumber) < dishCount ?
      coupon.num
      :
      relatedCouponDish.joinBenefitDishesNumber + dishCount;
  }
};
// 获取与礼品券有关的菜品优惠情况
const getRelatedToDishCouponProps = exports.getRelatedToDishCouponProps = function (coupon) {
  const lastOrderedDishes = JSON.parse(localStorage.getItem('lastOrderedDishes'));
  let relatedCouponDish = { name:null, number:null, couponValue:null, joinBenefitDishesNumber:0 };
  let benefitMoneyCollection = [];

  lastOrderedDishes.dishes.map(dish => {
    if (isSingleDishWithoutProps(dish)) {
      if (dish.brandDishId === coupon.dishId) {
        const dishCount = getDishesCount([dish]);
        const dishPrice = getDishPrice(dish);
        countRelatedDishGiftCouponPrice(dish, dishCount, dishPrice, relatedCouponDish, coupon, benefitMoneyCollection);
      }
    } else {
      dish.order.map(order => {
        if (dish.brandDishId === coupon.dishId) {
          const dishCount = order.count;
          const dishPrice = getOrderPrice(dish, order);
          countRelatedDishGiftCouponPrice(dish, dishCount, dishPrice, relatedCouponDish, coupon, benefitMoneyCollection);
        }
        return true;
      });
    }

    return true;
  });
  relatedCouponDish.couponValue = benefitMoneyCollection.length ? parseFloat((benefitMoneyCollection.reduce((c, p) => c + p)).toFixed(2)) : 0;
  return relatedCouponDish;
};
// 计算实际可用的优惠券的数量
exports.getCouponsLength = function (couponsList) {
  let couponLength = 0;
  couponsList.map(coupon => {
    if (coupon.coupDishBeanList.length) {
      // 表明优惠券与已点菜品相关
      if (getRelatedToDishCouponProps(coupon.coupDishBeanList[0]).name) {
        couponLength = couponLength + 1;
      }
    } else if (coupon.coupRuleBeanList.length) {
      if (coupon.coupDishBeanList.length) {
        return false;
      }
      couponLength = couponLength + 1;
    }
    return true;
  });
  return couponLength;
};
// 计算优惠券多少价格
const countPriceByCoupons = exports.countPriceByCoupons = function (coupon, totalPrice) {
  if (coupon.couponType === 1) {
    // '满减券'
    return +coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'offerValue')[0].ruleValue || 0;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return parseFloat(
      (
        totalPrice *
        (1 - Number(coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'zkValue')[0].ruleValue) / 10)
      ).toFixed(2)
    );
  } else if (coupon.couponType === 3) {
    // '礼品券';
    if (coupon.coupRuleBeanList.length && !coupon.coupDishBeanList.length) {
      return 0;
    }
    return getRelatedToDishCouponProps(coupon.coupDishBeanList[0]).couponValue;
  } else if (coupon.couponType === 4) {
    // '现金券';
    const ruleValue = +coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'faceValue')[0].ruleValue || 0;
    return ruleValue <= totalPrice ? ruleValue : totalPrice;
  }
  return true;
};

// 计算可以参与优惠的价格(针对的是有配送费减免的情况)
const getPriceCanBeUsedToBenefit = exports.getPriceCanBeUsedToBenefit = function (dishesPrice, deliveryProps) {
  // 这里需要判断一下  如果此时有配送费 并且配送费时可以减去的  那么不应该把配送费算作计入优惠的总价
  let totalPrice = '';
  if (Number(countDeliveryPrice(deliveryProps)) === Number(countDeliveryRemission(dishesPrice, deliveryProps))) {
    totalPrice = countTotalPriceWithoutBenefit(dishesPrice, deliveryProps)
    - Number(countDeliveryPrice(deliveryProps));
  } else {
    totalPrice = countTotalPriceWithoutBenefit(dishesPrice, deliveryProps);
  }
  return totalPrice;
};
// 计算出优惠券和会员价和活动优惠后的价格
const countPriceWithCouponAndDiscount = exports.countPriceWithCouponAndDiscount = function (dishesPrice, serviceProps) {
  const withoutBenefitPrice = getPriceCanBeUsedToBenefit(dishesPrice, serviceProps.deliveryProps);
  let totalPrice = serviceProps.activityBenefit.benefitMoney ?
    withoutBenefitPrice - serviceProps.activityBenefit.benefitMoney
    :
    withoutBenefitPrice;
  if (!serviceProps.couponsProps.inUseCoupon && !serviceProps.discountProps.inUseDiscount) {
    // 即没有使用任何优惠
    totalPrice = parseFloat(totalPrice.toFixed(2));
  } else {
    if (serviceProps.discountProps.inUseDiscount) {
      totalPrice = parseFloat((totalPrice - serviceProps.discountProps.inUseDiscount).toFixed(2));
    }
    if (serviceProps.couponsProps.inUseCoupon) {
      totalPrice = parseFloat(
        (totalPrice - countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, totalPrice)
      ).toFixed(2));
    }
  }
  return totalPrice;
};
// 处理积分优惠后还有多少待支付
const countPriceWithBenefit = exports.countPriceWithBenefit = function (dishesPrice, serviceProps) {
  const totalPrice = Number(countPriceWithCouponAndDiscount(dishesPrice, serviceProps));
  // 至此处理完了配送费和优惠券 还有折扣信息  需要考虑积分抵扣了
  const priceWithIntergrals = serviceProps.integralsInfo.isChecked ?
    totalPrice - countIntegralsToCash(totalPrice, serviceProps.integralsDetail).commutation
    :
    totalPrice;
  // 至此各种优惠信息已经处理完
  return parseFloat(priceWithIntergrals.toFixed(2));
};
// 计算自动进位规则
const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, dishesPrice, serviceProps) {
  // serviceProps.integralsDetail  前提条件
  const { transferType, scale } = carryRuleVO;
  const priceWithBenefit = countPriceWithBenefit(dishesPrice, serviceProps);
  if (_has(carryRuleVO, 'isEnjoyRule') && !carryRuleVO.isEnjoyRule) {
    return {
      smallChange:0,
      priceWithClearSmallChange:priceWithBenefit,
    };
  }
  if (transferType === 1) {
    // 四舍五入
    return {
      smallChange:parseFloat((priceWithBenefit - parseFloat(priceWithBenefit.toFixed(scale))).toFixed(2)),
      priceWithClearSmallChange:parseFloat((
        priceWithBenefit - parseFloat(
          Math.abs(priceWithBenefit - parseFloat(priceWithBenefit.toFixed(scale))).toFixed(scale)
        )).toFixed(scale)
      ),
    };
  } else if (transferType === 2) {
    // 无条件进位
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 1) {
      return priceWithBenefit.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithBenefit - Math.floor(priceWithBenefit * 10 + 1) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        priceWithBenefit
        :
        parseFloat((Math.floor(priceWithBenefit * 10 + 1) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithBenefit - Math.ceil(priceWithBenefit)).toFixed(2)),
        priceWithClearSmallChange:Math.ceil(priceWithBenefit),
      };
    }
  } else if (transferType === 3) {
    // 无条件舍去
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 1) {
      return priceWithBenefit.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithBenefit - Math.floor(priceWithBenefit * 10) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        priceWithBenefit
        :
        parseFloat((Math.floor(priceWithBenefit * 10) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithBenefit - Math.floor(priceWithBenefit)).toFixed(2)),
        priceWithClearSmallChange:Math.floor(priceWithBenefit),
      };
    }
  }
  return false;
};
// 计算优惠价格;
const countDecreasePrice = exports.countDecreasePrice = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  const clearSmallChangeProps = clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps);
  // smallChange>=0表示总数减少
  return clearSmallChangeProps.smallChange >= 0 ?
          parseFloat((countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
          - clearSmallChangeProps.priceWithClearSmallChange).toFixed(2))
          :
          parseFloat((countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
          - countPriceWithBenefit(dishesPrice, serviceProps)).toFixed(2));
};
// 计算最终该付多少钱
exports.countFinalNeedPayMoney = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  const clearSmallChangeProps = clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps);
  const initializePayMement = countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps) -
    countDecreasePrice(orderedDishesProps, serviceProps, commercialProps);
  return clearSmallChangeProps.smallChange >= 0 ?
    parseFloat(initializePayMement.toFixed(2))
    :
    parseFloat((initializePayMement - parseFloat(clearSmallChangeProps.smallChange)).toFixed(2));
};
// 校验收货地址信息
const validateAddressInfo = exports.validateAddressInfo = (info, isTakeaway, filter) => {
  const rules = {
    name: [
      { msg: '请输入姓名', validate(value) { return !!replaceEmojiWith(value.trim(), ''); } },
    ],
    sex: [
      { msg: '请选择性别', validate(value) {
        const gender = +value;
        return gender === 1 || gender === 0;
      } },
    ],
    mobile: [
      { msg: '请输入手机号', validate(value) { return !!value.trim(); } },
      { msg: '请录入正确的手机号', validate(value) { return /^1[34578]\d{9}$/.test(value); } },
    ],
  };

  if (isTakeaway) {
    Object.assign(rules, {
      baseAddress: [
        { msg: '请选择收货地址', validate(value) { return !!value.trim(); } },
      ],
      street: [
        { msg: '请输入门牌信息', validate(value) { return !!replaceEmojiWith(value.trim(), ''); } },
      ],
    });
  }
  for (const key in rules) {
    if (!rules.hasOwnProperty(key)) {
      continue;
    }
    if (filter && filter(key)) {
      continue;
    }
    const rule = rules[key];
    let value = info[key];
    if (typeof value !== 'number') {
      value = value || '';
    }
    for (let i = 0, len = rule.length; i < len; i++) {
      const item = rule[i];
      const valid = item.validate(value);
      if (!valid) {
        return { valid: false, msg: item.msg };
      }
    }
  }
  return { valid: true, msg: '' };
};

const getSubmitDishData = exports.getSubmitDishData = (dishesData, shopId) => {
  const result = { singleDishInfos: [], multiDishInfos: [] };
  const getSingleDishInfo = (dishes, func) => [].concat.apply([], (dishes || []).map(dish => {
    let orderDishes = [];
    const benefitDish = dish.benefitOptions || (dish.order[0] && dish.order[dish.order.length - 1].benefitOptions) || [];
    const beSelectedBenefit = _find(benefitDish, benefit => benefit.isChecked);
    let priId = dish.isMember ? 0 : null;
    let priType = dish.isMember ? 3 : null;// 会员价的情况
    if (beSelectedBenefit) {
      priId = beSelectedBenefit.priId;
      priType = beSelectedBenefit.priType;
    } else if (dish.noBenefit) {
      priId = null;
      priType = null;
    }
    const order = dish.order;
    const dishInfo = {
      num: 0,
      price: dish.marketPrice,
      ingredientIds: [],
      propertyIds: [],
      dishId: dish.id,
      shopId,
    };
    if (func) {
      func(dishInfo);
    }
    if (typeof order === 'number' && order > 0) {
      dishInfo.num = order;
      dishInfo.priId = priId;
      dishInfo.priType = priType;
      if (dish.dishPropertyTypeInfos && dish.dishPropertyTypeInfos.length) {
        (dish.dishPropertyTypeInfos || []).forEach(item => {
          [].push.apply(dishInfo.propertyIds, (item.properties || []).filter(subItem => subItem.isChecked).map(subItem => subItem.id));
        });
      }

      orderDishes.push(dishInfo);
    } else if (Array.isArray(order) && order.length) {
      let orderPrices = [];
      let orderNum = [];
      order.map(item => { orderPrices.push(getOrderPrice(dish, item)); orderNum.push(item.count); return true; });
      let maxOrderPrice = orderPrices[0];
      for (let i = 1; i < orderPrices.length; i++) {
        if (maxOrderPrice < orderPrices[i])maxOrderPrice = orderPrices[i];
      }
      let maxCount = orderNum[0];
      for (let i = 1; i < orderNum.length; i++) {
        if (maxCount < orderNum[i])maxCount = orderNum[i];
      }
      let orderIndex = 1;
      orderDishes = order.map(orderDish => {
        const duplicateDishInfo = Object.assign({}, dishInfo);
        duplicateDishInfo.num = orderDish.count;
        duplicateDishInfo.ingredientIds = (orderDish.dishIngredientInfos || []).filter(item => item.isChecked).map(item => item.id);
        duplicateDishInfo.propertyIds = [];
        (orderDish.dishPropertyTypeInfos || []).forEach(item => {
          [].push.apply(duplicateDishInfo.propertyIds, (item.properties || []).filter(subItem => subItem.isChecked).map(subItem => subItem.id));
        });
        if (orderIndex === 1 && beSelectedBenefit && beSelectedBenefit.type === 1 && getOrderPrice(dish, orderDish) === maxOrderPrice) {
          duplicateDishInfo.priId = priId;
          duplicateDishInfo.priType = priType;
          orderIndex += 1;
        }
        if (orderIndex === 1 && beSelectedBenefit && beSelectedBenefit.type === 2 && orderDish.count === maxCount) {
          duplicateDishInfo.priId = priId;
          duplicateDishInfo.priType = priType;
          orderIndex += 1;
        }
        if (orderIndex === 1 && beSelectedBenefit && beSelectedBenefit.priType === 2 && orderDish.hasGiftBenefit) {
          duplicateDishInfo.priId = priId;
          duplicateDishInfo.priType = priType;
          orderIndex += 1;
        }
        if (!beSelectedBenefit && dish.isMember && !dish.noBenefit) {
          duplicateDishInfo.priId = priId;
          duplicateDishInfo.priType = priType;
        }
        return duplicateDishInfo;
      });
    }
    return orderDishes.filter(orderDish => orderDish.num > 0);
  }));

  result.singleDishInfos = getSingleDishInfo(dishesData.filter(dish => dish.type === 0));
  result.multiDishInfos = [].concat.apply([], dishesData.filter(dish => dish.type === 1).map(dish => {
    const orderDishes = [];
    const benefitDish = dish.benefitOptions || (dish.order[0] && dish.order[0].benefitOptions) || [];
    const beSelectedBenefit = _find(benefitDish, benefit => benefit.isChecked);
    let priId = beSelectedBenefit ? beSelectedBenefit.priId : null;
    let priType = beSelectedBenefit ? beSelectedBenefit.priType : null;
    if (!beSelectedBenefit && !dish.noBenefit && dish.isMember) {
      priId = 0;
      priType = 3;
    }
    const dishInfo = { num: 0, price: dish.marketPrice, priId, priType, dishId: dish.id, subDish: [], shopId };
    (dish.order || []).forEach(orderDish => {
      if (!orderDish.count) {
        return;
      }

      const duplicateDishInfo = Object.assign({}, dishInfo, { num: orderDish.count, subDish: [] });
      (orderDish.groups || []).forEach(group => {
        [].push.apply(duplicateDishInfo.subDish, getSingleDishInfo(group.childInfos, info => {
          const _info = info;
          _info.groupId = group.id;
        }));
      });
      orderDishes.push(duplicateDishInfo);
    });
    return orderDishes;
  }));
  return result;
};

exports.getSubmitUrlParams = (state, note, receipt) => {
  // const name = state.customerProps.name || '';
  const type = getUrlParam('type');
  // if (!name && type === 'TS' && state.customerProps.loginType === 1) {
  //   return { success:false, msg: '未填写姓名' };
  // }

  const dishes = state.orderedDishesProps.dishes;
  const dishesPrice = getDishesPrice(dishes);
  const integral = state.serviceProps.integralsInfo.isChecked ? countIntegralsToCash(
    Number(countPriceWithCouponAndDiscount(dishesPrice, state.serviceProps)),
    state.serviceProps.integralsDetail
  ).integralInUsed : false;
  const needPayPrice = clearSmallChange(
    state.commercialProps.carryRuleVO,
    dishesPrice,
    state.serviceProps
  ).priceWithClearSmallChange;
  // 金额为0的时候只有线下支付
  let payMethodScope = null;
  if (needPayPrice !== 0) {
    payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '2' : '1';
  } else {
    payMethodScope = '1';
  }

  const useDiscount = !state.serviceProps.discountProps.inUseDiscount ? 0 : 1;
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCoupon &&
                state.serviceProps.couponsProps.inUseCouponDetail.id ?
                state.serviceProps.couponsProps.inUseCouponDetail.id
                :
                '0';
  let tableId;
  if (type === 'TS' && serviceApproach === 'totable' && state.tableProps.tables && state.tableProps.tables.length) {
    if (state.tableProps.tables.filter(table => table.isChecked).length === 0) {
      return state.serviceProps.serviceApproach.indexOf('pickup') !== -1 && state.serviceProps.serviceApproach.indexOf('totable') === -1 ?
        { success:false, msg:'请打开前台取餐开关' }
        :
        { success:false, msg:'未选择桌台信息' };
    }
    tableId = state.tableProps.tables.filter(table => table.isChecked)[0].synFlag;
  } else if (type === 'TS' && serviceApproach && serviceApproach.indexOf('pickup') !== -1 || type === 'WM') {
    tableId = 0;
  } else {
    return { success:false, msg:'没有可用桌台' };
  }

  const params = {
    shopId: getUrlParam('shopId'),
    coupId,
    useDiscount,
    memo: note,
    needPayPrice,
    integral: Number(integral),
    payMethod: payMethodScope,
    invoice: receipt,
  };
  Object.assign(params, getSubmitDishData(dishes || []), parseInt(params.shopId, 10) || 0);
  if (type === 'WM') {
    const sendAreaId = state.serviceProps.sendAreaId === -1 ? 0 : state.serviceProps.sendAreaId;
    const selectedDateTime = state.timeProps.selectedDateTime;
    let selectedAddress = null;
    let isSelfFetch = false;
    if (state.customerProps.addresses instanceof Array && state.customerProps.addresses.length) {
      selectedAddress = state.customerProps.addresses.find(address => address.isChecked);
    }
    if (!selectedAddress) {
      return { success:false, msg:'请选择送餐地址' };
    }

    const validateAddressResult = validateAddressInfo(selectedAddress, true, key => ['baseAddress', 'street'].indexOf(key) !== -1);
    if (!validateAddressResult.valid) {
      return { success: false, msg: validateAddressResult.msg };
    }

    const sex = selectedAddress.sex;
    isSelfFetch = selectedAddress.id === 0;
    if (!selectedDateTime.date) {
      return { success: false, msg: `请选择${isSelfFetch ? '取餐' : '送达'}时间` };
    }
    const toShopFlag = isSelfFetch ? 1 : 0;
    let mobile = selectedAddress.mobile.toString();
    if (mobile.indexOf('4') === 0 && mobile.length === 9) {
      mobile = '0' + mobile;
    }
    const latitude = selectedAddress.latitude || 0;
    const longitude = selectedAddress.longitude || 0;
    Object.assign(params, {
      name: selectedAddress.name,
      mobile,
      sex,
      orderType: 'WM',
      address: isSelfFetch ? '' : selectedAddress.address,
      memberAddressId: selectedAddress.id,
      sendAreaId,
      toShopFlag,
      latitude,
      longitude,
    });
    if (selectedDateTime.time) {
      if (selectedDateTime.time !== '立即取餐' && selectedDateTime.time !== '立即送餐') {
        params.time = `${selectedDateTime.date} ${selectedDateTime.time}`;
      }
    }
  } else {
    const sex = +String(state.customerProps.sex) || '';
    // 仅手机号登陆登录校验性别
    // if (state.customerProps.loginType === 0 && (isNaN(sex) || sex === -1)) {
    //   return { success: false, msg:'未选择性别' };
    // }

    Object.assign(params, {
      name: state.customerProps.name || '',
      mobile: state.customerProps.mobile,
      sex,
      orderType: 'TS',
      tableId,
      peopleCount: state.customerProps.customerCount,
      serviceApproach,
    });
  }
  return { success: true, params, needPayPrice };
};

const filterChosenDish = exports.filterChosenDish = (dishes, benefitProp) => {
  let newDishes = dishes.asMutable({ deep: true });
  newDishes.filter(function (dish) {
    if (dish.benefitOptions) {
      return dish;
    } else if (dish.order[0] && dish.order[dish.order.length - 1].benefitOptions) {
      return dish;
    }
    return false;
  }).map(dish => {
    (dish.benefitOptions || dish.order[dish.order.length - 1].benefitOptions).forEach(benefit => {
      if (benefitProp.dishId === dish.brandDishId && benefit.priId === benefitProp.priId) {
        benefit.isChecked = true;
        dish.noUseDiscount = true;
        dish.noBenefit = false;
        let reduce = benefitProp.reduce ? benefitProp.reduce : ((1 - benefitProp.discount / 10) * dish.marketPrice) * benefitProp.dishNum;
        if (benefitProp.priType === 1) {
          if (dish.benefitOptions) {
            dish.activityBenefit = getDishPrice(dish) >= reduce ? reduce : getDishPrice(dish);
          } else {
            //  我们把优惠分配到每个OrderedDish上   因为orderedDish会把dish按照order拆开
            // dish.activityBenefit = parseFloat((reduce / dish.order.length).toFixed(2));
            dish.order.forEach(item => {
              item.activityBenefit = 0;
              let eachOrderPrice = getOrderPrice(dish, item);
              if (eachOrderPrice >= reduce) {
                item.activityBenefit = reduce;
                reduce = 0;
              } else {
                item.activityBenefit = eachOrderPrice;
                reduce = reduce - eachOrderPrice;
              }
            });
          }
        } else {
          // 礼品券的情况
          if (isSingleDishWithoutProps(dish)) {
            dish.activityBenefit = benefitProp.dishNum >= dish.order ?
              dish.marketPrice * dish.order : dish.marketPrice * benefitProp.dishNum;
          } else {
            dish.activityBenefit = 0;
            let benefitNumber = benefitProp.dishNum || 1;
            for (let i = 0; i <= benefitNumber; i++) {
              const eachOrderPrice = getOrderPrice(dish, dish.order[i]) / dish.order[i].count;
              if (dish.order[i].count >= benefitNumber) {
                dish.order[i].activityBenefit = eachOrderPrice >= dish.marketPrice ?
                  dish.marketPrice * benefitNumber : eachOrderPrice * benefitNumber;
                dish.order[i].hasGiftBenefit = true;
                benefitNumber = 0;
              }
            }
          }
        }
      } else if (benefitProp.dishId === dish.brandDishId) {
        benefit.isChecked = false;
      }
    });
    return dish;
  });
  return newDishes;
};
exports.reorganizedActivityBenefit = (activityBenefit, dishes, benefitProp) => {
  const newDishes = filterChosenDish(dishes, benefitProp); // newDishes此时是可编辑状态
  const newActivityBenefit = activityBenefit.asMutable({ deep: true });
  if (benefitProp.priType === 1) {
    newActivityBenefit.benefitMoney += benefitProp.reduce;
  }
  return {
    dishes:newDishes,
    activityBenefit:newActivityBenefit,
  };
};
// 活动优惠菜品选择会员价 或者不选择任何优惠
exports.setDishBenefitInfo = (chosenDish, dish, benefitType) => {
  if (chosenDish.id !== dish.id) {
    return dish;
  }
  let newDish = dish.asMutable({ deep: true });
  newDish.noUseDiscount = benefitType !== 'discount';
  newDish.noBenefit = benefitType !== 'discount';
  if (newDish.benefitOptions || (newDish.order[0] && newDish.order[newDish.order.length - 1].benefitOptions)) {
    if (isSingleDishWithoutProps(newDish)) {
      newDish.activityBenefit = 0; // 活动优惠和礼品券全部归0
      newDish.benefitOptions.forEach(benefit => benefit.isChecked = false);
    } else {
      newDish.activityBenefit = 0;
      newDish.order.forEach(order => {
        order.activityBenefit = 0;
      });
      newDish.order[newDish.order.length - 1].benefitOptions.forEach(benefit => benefit.isChecked = false);
    }
  }
  return newDish;
};
const countAcvitityMoney = exports.countAcvitityMoney = (dishes) => {
  let acvitityCollection = [];
  dishes.filter(dish => dish.benefitOptions || (dish.order[0] && dish.order[dish.order.length - 1].benefitOptions)).map(dish => {
    let dishAcvitityCollection = [];
    if (isSingleDishWithoutProps(dish)) {
      dishAcvitityCollection.push(dish.activityBenefit ? dish.activityBenefit : 0);
    } else {
      dish.order.map(order => {
        dishAcvitityCollection.push(order.activityBenefit ? order.activityBenefit : 0);
        return true;
      });
      if (dish.activityBenefit) {
        dishAcvitityCollection.push(dish.activityBenefit * dish.order.length);
      }
    }
    if (parseFloat((dishAcvitityCollection.reduce((c, p) => c + p)).toFixed(2)) > getDishPrice(dish)) {
      dishAcvitityCollection = []; dishAcvitityCollection.push(getDishPrice(dish));
    }
    for (let i = 0; i < dishAcvitityCollection.length; i++) {
      acvitityCollection.push(dishAcvitityCollection[i]);
    }
    return true;
  });
  return acvitityCollection.length ? parseFloat((acvitityCollection.reduce((c, p) => c + p)).toFixed(2)) : 0;
};
// 为已点菜品添加对应的优惠选项
const addBenefitTodish = exports.addBenefitTodish = (benefitProps, dish, dishes) => {
  let orderedDish = dish.asMutable({ deep: true });
  benefitProps.dishPriList.map(benefit => {
    if (benefit.dishId === orderedDish.brandDishId) {
      benefit.dishPriInfo.forEach(info => { info.id = info.priId; info.dishId = orderedDish.brandDishId; });
      if (orderedDish.order instanceof Array) {
        const hasGiftCoupon = _find(benefit.dishPriInfo, info => info.priType === 2);
        if (hasGiftCoupon) {
          const hasMoreCountDish = getDishesPrice(dishes) >= hasGiftCoupon.fullValue;
          // 表面有复合礼品券优惠的菜品
          if (hasMoreCountDish) {
            orderedDish.order[orderedDish.order.length - 1].benefitOptions = benefit.dishPriInfo;
          } else {
            orderedDish.order[orderedDish.order.length - 1].benefitOptions = benefit.dishPriInfo.filter(info => info.priType !== 2);
          }
        } else {
          orderedDish.order[orderedDish.order.length - 1].benefitOptions = benefit.dishPriInfo;
        }

        if (!orderedDish.isMember) {
          orderedDish.order[orderedDish.order.length - 1].benefitOptions[0].isChecked = true;
          orderedDish = filterChosenDish(Immutable.from([orderedDish]), orderedDish.order[orderedDish.order.length - 1].benefitOptions[0]);
        }
      } else {
        const hasGiftCoupon = _find(benefit.dishPriInfo, info => info.priType === 2);
        if (hasGiftCoupon) {
          if (getDishesPrice(dishes) >= hasGiftCoupon.fullValue) {
            orderedDish.benefitOptions = benefit.dishPriInfo;
          } else {
            orderedDish.benefitOptions = benefit.dishPriInfo.filter(info => info.priType !== 2);
          }
        } else {
          orderedDish.benefitOptions = benefit.dishPriInfo;
        }

        if (!orderedDish.isMember) {
          orderedDish.benefitOptions[0].isChecked = true;
          orderedDish = filterChosenDish(Immutable.from([orderedDish]), orderedDish.benefitOptions[0]);
        }
      }
    }
    return true;
  });
  return orderedDish instanceof Array ? orderedDish[0] : orderedDish;
};
exports.countInitializeBenefit = (benefitProps, dishes) => {
  let newOrderedDishes = dishes.asMutable({ deep: true });
  let dishCollection = [];
  for (let i = 0; i < newOrderedDishes.length; i++) {
    let dish = addBenefitTodish(benefitProps, Immutable.from(newOrderedDishes[i]), dishes);
    dishCollection.push(dish);
  }
  return countAcvitityMoney(dishCollection);
};
// 计算附加费（正餐）
exports.countExtraPrivilege = (privilegeArray) => {
  if (!privilegeArray) { return false; }
  let benefitCollection = [];
  privilegeArray.map(privilege => benefitCollection.push(+privilege.privilegeAmount));
  return benefitCollection.length ? parseFloat((benefitCollection.reduce((c, p) => c + p)).toFixed(2)) : 0;
};
