const orderHelper = require('../../src/helper/order-helper.js');
const integralProps = require('../fake-data/fake-intergral.js');
const coupon = require('../fake-data/fake-coupon.js');
const tableProps = require('../fake-data/fake-tableProps.js');
describe('Helper', function () {
  describe('Order Related Helper', function () {
    it('isEmptyObject', function () {
      orderHelper.isEmptyObject({}).should.equal(true);
      orderHelper.isEmptyObject({ test:'123' }).should.equal(false);
    });

    it('getSelectedTable', function () {
      orderHelper.getSelectedTable(tableProps)
        .should.have.deep.property('area.id', 8836);
      orderHelper.getSelectedTable(tableProps)
        .should.have.deep.property('table.tableID', 4000231922);
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
