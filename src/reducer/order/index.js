const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    areaList:[],
    tableList:[],
    timeJson:{},
    diningerProps:{},
    commercialProps:{},
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      const diningerProps = Object.assign({}, { name:payload.name }, { sex:payload.sex },
      { isMember:payload.isMember }, { serviceApproach:payload.serviceApproach });
      const commercialProps = Object.assign({}, { name:payload.commercialName }, { integral:payload.integral },
      { commercialLogo:payload.commercialLogo }, { pickupPayType:payload.pickupPayType },
      { totablePayType:payload.totablePayType });
      return state.setIn(['areaList'], payload.areaList)
                  .setIn(['tableList'], payload.tableList)
                  .setIn(['timeJson'], payload.timeJson)
                  .setIn(['diningerProps'], diningerProps)
                  .setIn(['commercialProps'], commercialProps);
    }
    default:
      return state;
  }
};
