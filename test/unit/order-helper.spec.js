const orderHelper = require('../../src/helper/order-helper.js');
const integralProps = require('../data/intergral.js');
const coupon = require('../data/coupon.js');
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
      orderHelper.countIntegralsToCash(100, integralProps.intergralTest1)
        .should.deep.equal({ commutation:96, integralInUsed:276 });
      orderHelper.countIntegralsToCash(1000, integralProps.intergralTest2)
          .should.deep.equal({ commutation:624, integralInUsed:1794 });
    });

    it('countPriceByCoupons', function () {
      orderHelper.countPriceByCoupons(coupon.couponTest1, 20).should.equal(20);
    });
  });
});
