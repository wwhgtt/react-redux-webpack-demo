const getTotalRrice = function (array) {
  let totalRrice = 0;
  for (let i = 0; i < array.length; i ++) {
    totalRrice += array[i].price;
  }
  return totalRrice;
};

exports.getOrderDetail = (orderDetail) => {
  const dishTotal = orderDetail.orderMetas.pop();
  orderDetail.dishTotal = dishTotal;
  const totalRrice = getTotalRrice(orderDetail.dishTotal.dishItems);
  const priviledgeAmount = dishTotal.priviledgeAmount || 0;

  orderDetail.dishTotal.totalRrice = totalRrice - priviledgeAmount;
  return orderDetail;
};
