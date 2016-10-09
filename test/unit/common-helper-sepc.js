const commonHelper = require('../../src/helper/common-helper.js');
const expect = require('chai').expect;
describe('Helper', () => {
  describe('Common Related Helper', () => {
    const dateUtility = commonHelper.dateUtility;
    it('dateUtility.parse', () => {
      expect(dateUtility.parse(null)).to.be.equal(null);
      expect(dateUtility.parse('2011-1-12').getTime())
        .to.equal(+new Date(2011, 0, 12));
      expect(dateUtility.parse('2011-1-12 20:10:10').getTime())
        .to.be.equal(+new Date(2011, 0, 12, 20, 10, 10));
      expect(dateUtility.parse('xxxx')).to.be.equal(null);
    });
  });
});
