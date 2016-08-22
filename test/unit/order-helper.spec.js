const orderHelper = require('../../src/helper/order-helper.js');
const integralProps = require('../data/intergral.js');
describe('Helper', function () {
  describe('Order Related Helper', function () {
    it('isEmptyObject', function () {
      orderHelper.isEmptyObject({}).should.equal(true);
      orderHelper.isEmptyObject({ test:'123' }).should.equal(false);
    });

    it('getSelectedTable', function () {
      orderHelper.getSelectedTable({ areas:[{ isChecked:true, id:100 }], tables:[{ isChecked:true, id:200 }] })
        .should.deep.equal({ area:{ isChecked:true, id:100 }, table:{ isChecked:true, id:200 } });
    });

    it('countIntegralsToCash', function () {
      console.log(integralProps);
      orderHelper.countIntegralsToCash(100, integralProps)
        .should.deep.equal({ commutation:96, integralInUsed:276 });
    });
  });
});
