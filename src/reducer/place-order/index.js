const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      logo:null,
      name:null,
    },
    timeProps:null,
    tableProps:null,
  }),
  action
) {
  // const { type, payload } = action;
  // switch (type) {
  //   case '':
  //     return state;
  //   default:
  // }
  return state;
};
