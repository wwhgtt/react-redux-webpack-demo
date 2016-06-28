const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    areaList:[],
    tableList:[],
    timeJson:{},
    customerProps:{},
    commercialProps:{},
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.set('areaList', payload.areaList)
                  .set('tableList', payload.tableList)
                  .set('timeJson', payload.timeJson)
                  .set('customerProps', Immutable.from({ name:payload.name, sex:payload.sex, isMember:payload.isMember,
                        serviceApproach:payload.serviceApproach, mobile:payload.member.mobile, customerCount:1 }))
                  .set('commercialProps', Immutable.from({ name:payload.commercialName, integral:payload.integral,
                        commercialLogo:payload.commercialLogo, pickupPayType:payload.pickupPayType, totablePayType:payload.totablePayType }));
    }
    default:
      return state;
  }
};
