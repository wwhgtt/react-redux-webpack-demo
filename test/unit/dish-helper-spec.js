const should = require('chai').should();
const dishHelper = require('../../src/helper/dish-hepler');

describe('Helper', function () {
  describe('Dish Related Helper', function () {
    it('isGroupDish', function () {
      dishHelper.isGroupDish({ groups:[] }).should.equal(true);
      dishHelper.isGroupDish({}).should.equal(false);
    });

    it('isChildDish', function () {
      dishHelper.isChildDish({ isChildDish:true }).should.equal(true);
      should.equal(!!dishHelper.isChildDish({}), false);
    });
  });
});
