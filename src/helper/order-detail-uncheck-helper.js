const dateUtility = require('./common-helper.js').dateUtility;

const sexFormat = function (orderSex) {
  let sex = '';
  if (orderSex === 0) {
    sex = '女士';
  } else if (orderSex === 1) {
    sex = '先生';
  } else {
    sex = '';
  }
  return sex;
};


exports.getOrderDetail = (orderDetail) => {
  const dishTotal = orderDetail.orderMetas.pop();
  orderDetail.dishTotal = dishTotal;
  const orderMetas = orderDetail.orderMetas;
  const dishItems = dishTotal.dishItems;

  // 优惠总计处理
  if (dishTotal.priviledgeAmount) {
    dishTotal.priviledgeAmount = (dishTotal.priviledgeAmount).toString().replace(/[^\d^.]/g, '');
  }

  // 总单数据处理
  for (let i = 0; i < dishItems.length; i ++) {
    dishItems[i].status = null;
  }

  // 加菜数据处理
  for (let i = 0; i < orderMetas.length; i ++) {
    orderMetas[i].sex = sexFormat(orderMetas[i].sex); // 加菜性别格式
    orderMetas[i].dateTime = dateUtility.format(new Date(orderMetas[i].dateTime), 'HH:mm'); // 加菜时间
  }

  return orderDetail;
};
