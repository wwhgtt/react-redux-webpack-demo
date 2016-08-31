const should = require('chai').should();
const dishHelper = require('../../src/helper/dish-hepler');
const fakeDishes = require('../fake-data/fake-dishes.js');
/* eslint no-unused-expressions: 1 */
describe('Helper', function () {
  describe('Dish Related Helper', function () {
    it('isSingleDishWithoutProps', function () {
      dishHelper.isSingleDishWithoutProps(fakeDishes.groupDish).should.to.be.false;
      dishHelper.isSingleDishWithoutProps(fakeDishes.singleDishWithProps).should.to.be.false;
      dishHelper.isSingleDishWithoutProps(fakeDishes.singleDishWithoutProps).should.to.be.true;
    });

    it('isGroupDish', function () {
      dishHelper.isGroupDish(fakeDishes.groupDish).should.to.be.true;
      dishHelper.isGroupDish(fakeDishes.singleDishWithoutProps).should.to.be.false;
      dishHelper.isGroupDish(fakeDishes.singleDishWithProps).should.to.be.false;
    });

    it('isChildDish', function () {
      dishHelper.isChildDish({ isChildDish:true }).should.to.be.true;
      should.equal(!!dishHelper.isChildDish({}), false);
    });

    // getOrderedDishes
    it('getOrderedDishes', function () {
      // Except return an array with two ordered dish objects.
      dishHelper.getOrderedDishes(fakeDishes.orderedSingleDishesAndGroupDishes).should.have.lengthOf(2);
      dishHelper.getOrderedDishes(fakeDishes.orderedSingleDishesOnly).should.have.lengthOf(2);
      dishHelper.getOrderedDishes(fakeDishes.orderedGroupDishesOnly).should.have.lengthOf(2);
    });

    // getDishesCount
    it('getDishesCount', function () {
      // Except return 10.
      dishHelper.getDishesCount(fakeDishes.orderedSingleDishesAndGroupDishes).should.equal(10);
      dishHelper.getDishesCount(fakeDishes.orderedSingleDishesOnly).should.equal(10);
      dishHelper.getDishesCount(fakeDishes.orderedGroupDishesOnly).should.equal(10);
    });

    // getOrderPrice

    // getDishPrice
    it('getDishPrice', function () {
      // Except return 36. (12 * 3)
      dishHelper.getDishPrice(fakeDishes.singleDishWithoutProps).should.equal(36);
      // Except return 72. [(21 + 1) * 1 + (21 + 2 + 2) * 2]
      dishHelper.getDishPrice(fakeDishes.singleDishWithProps).should.equal(72);
      // Except return 56. (28 * 2)
      dishHelper.getDishPrice(fakeDishes.groupDish).should.equal(56);
    });

    // generateDishNameWithUnit
    it('generateDishNameWithUnit', function () {
      dishHelper.generateDishNameWithUnit(fakeDishes.singleDishWithUnit).should.equal('菜品名称/份');
      dishHelper.generateDishNameWithUnit(fakeDishes.singleDishWithPropAndUnit).should.equal('菜品名称(显示)/份');
    });

    /* dish-helper part-2 */
    const cloneObject = source => source && JSON.parse(JSON.stringify(source));
    it('isShopOpen', () => {
    // null or [] 表示24小时营业
      dishHelper.isShopOpen(null).should.to.be.true;
      dishHelper.isShopOpen([]).should.to.be.true;

      const now = new Date();
      const [hours, minutes, seconds] = [now.getHours(), now.getMinutes(), now.getSeconds()];
      const day = now.getDay();
      const getTestData = week => {
        const ret = {
          true: new Array(2).fill(1).map((item, index) => {
            const increment = index + 1;
            return {
              week,
              startTime: [hours, 0, 0].join(':'),
              endTime: [hours + increment, minutes, seconds].join(':'),
            };
          }),
          false: new Array(2).fill(1).map((item, index) => {
            const increment = index + 2;
            return {
              week,
              startTime: [hours + increment, 0, 0].join(':'),
              endTime: [hours + increment, minutes + increment, seconds + increment].join(':'),
            };
          }),
        };
        return ret;
      };

    // week == 7 表示一周7天营业
      dishHelper.isShopOpen(getTestData(7).true).should.to.be.true;
      dishHelper.isShopOpen(getTestData(7).false).should.to.be.false;


    // week == 1 表示周末营业
      dishHelper.isShopOpen(getTestData(1).true).should.equal(day === 0 || day === 6);
      dishHelper.isShopOpen(getTestData(1).false).should.to.be.false;

    // week == 0 表示周1-5营业
      dishHelper.isShopOpen(getTestData(0).true).should.equal(day >= 1 && day <= 5);
      dishHelper.isShopOpen(getTestData(0).false).should.equal(false);
    });

    it('hasSelectedProps', () => {
      const data = {
        dishTypeId: 18,
        id: 599385,
        name: '红烧排骨1',
      };
      const testData = {
        true: Object.assign({}, data, {
          order: [{
            dishIngredientInfos: [
              { name: '奶茶修改', isChecked: false },
            ],
            dishPropertyTypeInfos: [
              { name: '备注', properties: [{ name: '多糖', isChecked: true }] },
            ],
          }],
        }),
        false: Object.assign({}, data, {
          order: [{
            dishIngredientInfos: [],
            dishPropertyTypeInfos: [],
          }],
        }),
      };
      dishHelper.hasSelectedProps(testData.true).should.to.true;
      dishHelper.hasSelectedProps(testData.false).should.to.false;
    });

    it('getNewCountOfDish', () => {
      const _singleDishWithoutProps = Object.assign({}, fakeDishes.singleDishWithoutProps);
      // isSingleDishWithoutProps = true, order = undefined, result = dishIncreaseUnit
      _singleDishWithoutProps.order = undefined;
      dishHelper.getNewCountOfDish(_singleDishWithoutProps, 1).should.to.equal(_singleDishWithoutProps.dishIncreaseUnit);

      _singleDishWithoutProps.order = 1;
      dishHelper.getNewCountOfDish(_singleDishWithoutProps, 1).should.to.equal(2);

      // order + increment < dishIncreaseUnit ? undefined : order + increment;
      _singleDishWithoutProps.order = 0;
      should.equal(dishHelper.getNewCountOfDish(_singleDishWithoutProps, 0), undefined);

      const _groupDish = JSON.parse(JSON.stringify(fakeDishes.groupDish));
      const firstOrder = _groupDish.order[0];
      // count = 0, result = dishIncreaseUnit
      firstOrder.count = 0;
      dishHelper.getNewCountOfDish(_groupDish, 1).should.to.equal(_groupDish.dishIncreaseUnit);

      // count
      firstOrder.count = 2;
      dishHelper.getNewCountOfDish(_groupDish, 1).should.to.equal(3);

      // count + increment < dishIncreaseUnit ? 0 : count + increment;
      firstOrder.count = 1;
      _groupDish.dishIncreaseUnit = 3;
      should.equal(dishHelper.getNewCountOfDish(_groupDish, 1), 0);
    });

    it('getDishesPrice', () => {
      const singleDishWithoutProps = cloneObject(fakeDishes.singleDishWithoutProps);
      const groupDish = cloneObject(fakeDishes.groupDish);

      singleDishWithoutProps.order = 10;
      dishHelper.getDishesPrice([singleDishWithoutProps]).should.to.equal(120);

      dishHelper.getDishesPrice([groupDish]).should.to.equal(56);
    });

    it('getDishBoxprice', () => {
      dishHelper.getDishBoxprice([], null).should.to.equal(0);
      const singleDishWithoutProps = cloneObject(fakeDishes.singleDishWithoutProps);
      const groupDish = cloneObject(fakeDishes.groupDish);
      singleDishWithoutProps.order = 1;
      dishHelper.getDishBoxprice([singleDishWithoutProps], { orderFlag: 0, content: 10 }).should.to.equal(0);

      groupDish.order[0].groups[0].childInfos[0].order = 1;
      dishHelper.getDishBoxprice([groupDish], { orderFlag: 1, content: 10 }).should.to.equal(10);
    });

    it('getDishBoxCount', () => {
      dishHelper.getDishBoxprice([], null).should.to.equal(0);
      const singleDishWithoutProps = cloneObject(fakeDishes.singleDishWithoutProps);
      const groupDish = cloneObject(fakeDishes.groupDish);

      singleDishWithoutProps.order = 2;
      dishHelper.getDishBoxCount([singleDishWithoutProps]).should.to.equal(2);

      groupDish.order[0].groups[0].childInfos[0].order = 2;
      dishHelper.getDishBoxCount([groupDish]).should.to.equal(2);
    });
  });
});
