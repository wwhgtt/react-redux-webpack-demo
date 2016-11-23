const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');
const helper = require('../../helper/dish-helper');
require('./book-info-sub-item.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'BookInfoSubItem',
  propTypes:{
    subDishItemList:React.PropTypes.array,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() { },
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getPropertyType(item) {
    let propertyType = '';
    if (item.propertyTypeList && item.propertyTypeList.length > 0) {
      item.propertyTypeList.forEach((itemt, indext) => {
        if (itemt.type === 4) {
          return false;
        }
        propertyType += ` ${itemt.name}:`;
        itemt.properties.forEach((itemtt, indextt) => {
          propertyType += `${itemtt.name},`;
        });
        return true;
      });
    }
    return propertyType.substring(0, propertyType.length - 1);
  },
  getDishIngredientInfos(item) {
    let dishIngredientInfos = '';
    if (item.dishIngredientInfos && item.dishIngredientInfos.length > 0) {
      item.dishIngredientInfos.forEach((itemt, indext) => {
        dishIngredientInfos += `${itemt.name},`;
      });
    }
    return dishIngredientInfos.substring(0, dishIngredientInfos.length - 1);
  },
  getReprice(item) {
    return item.num * item.marketPrice;
  },
  render() {
    const { subDishItemList } = this.props;

    return (
      <div className="sub-option-group">
        {
          subDishItemList.map((item, index) => {
            const propertyType = this.getPropertyType(item);
            const dishIngredientInfos = this.getDishIngredientInfos(item);
            const reprice = this.getReprice(item);
            return (
              <div className="sub-option" key={index}>
                <div className="clearfix">
                  <div className="sub-option-name ellipsis fl">
                    {helper.generateDishNameWithUnit(item)}
                    <i className="sub-option-reprice">+{reprice}</i>
                  </div>
                  <div className="sub-option-number fr ellipsis">x2</div>
                </div>
                {propertyType || dishIngredientInfos ?
                  <div className="sub-option-brief ellipsis">
                  {propertyType} &nbsp;
                  {
                    dishIngredientInfos &&
                      `配料:${dishIngredientInfos}`
                  }
                  </div>
                  :
                  false
                }
              </div>
            );
          })
        }
      </div>
    );
  },
});
