const dateUtility = require('./common-helper.js').dateUtility;

const getTotalRrice = function (array) {
  let totalRrice = 0;
  for (let i = 0; i < array.length; i ++) {
    totalRrice += array[i].price;
  }
  return totalRrice;
};

const sexFormat = function (orderSex) {
  let sex = '';
  if (orderSex === 0) {
    sex = '女士';
  } else if (orderSex === 1) {
    sex = '男士';
  } else {
    sex = '';
  }
  return sex;
};


exports.getOrderDetail = (orderDetail) => {
  const dishTotal = orderDetail.orderMetas.pop();
  orderDetail.dishTotal = dishTotal;
  const totalRrice = getTotalRrice(orderDetail.dishTotal.dishItems);
  const priviledgeAmount = dishTotal.priviledgeAmount || 0;
  const orderMetas = orderDetail.orderMetas;
  const dishItems = dishTotal.dishItems;

  orderDetail.dishTotal.totalRrice = totalRrice - priviledgeAmount;

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
