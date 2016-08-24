module.exports = {
  path:'/user/getAddressList.json',
  template:{
    data:
    {
      inList:[
        {
          rangeId: 1,
          wXMemberAddress: {
            id:263094,
            address:'北京市北京市东城区复合大街113号',
            memberID:23678888,
            name:'Alex',
            sex:0,
            mobile:'15102087655',
            status:0,
            longitude:'34.32000',
            latitude:'45.22000',
          },
        },
        {
          rangeId: 1,
          wXMemberAddress: {
            id:263099,
            address:'天府软件园E1',
            memberID:23678882,
            name:'我是谁',
            sex:1,
            mobile:'15102087655',
            status:0,
            longitude:'104.066082',
            latitude:'30.542718',
          },
        }],
      outList:[
        {
          id:263094,
          address:'北京市北京市东城区复合大街113号',
          memberID:23678888,
          name:'我是谁',
          sex:1,
          mobile:'15102087655',
          status:0,
          longitude:'34.32000',
          latitude:'45.22000',
        },
        {
          id:263099,
          address:'北京市北京市东城区王府井118号',
          memberID:23678881,
          name:'神仙姐姐',
          sex:0,
          mobile:'15102087655',
          status:0,
          longitude:'34.32000',
          latitude:'45.82000',
        }],
      toShopInfo:
      {
        toShopFlag:true,
        name:'我想我是海',
        sex:1,
        mobile:'15102089880',
        weixinSellPrice: 15.5,
      },
    },
    msg: '',
    time: 1467811619403,
    code: '200',
  },
};
