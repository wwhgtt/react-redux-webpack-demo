const orderHelper = require('../../src/helper/order-helper.js');

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
  });
});
