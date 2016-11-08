module.exports = {
  path: '/order/bookingList.json',
  template: {
    data: {
      list:[{
        orderId: 3522562,
        shopLogo: 'http://kry-test-2.qiniudn.com/57d4823cad4046eda519a16f5652de11.jpg?imageView/2/w/512/h/512',
        shopName: '小铠甲火锅(小铠甲火锅西门店)',
        tablePersonCount: 4,
        orderTime: '11月07日 周一 15:30',
        tableTypeName: '一楼',
        bookingStatus: 5, // 1,2,3,4,5,6 => 预定成功, 确认中, 已到店, 预定取消, 预定失败, 未到店
        tradeItemsShortCut: '我是套餐等3件商品',
        serialNumber: '1234',
      }],
    },
    time: 1472436273622,
    code: '200',
    msg: '',
  },
};
