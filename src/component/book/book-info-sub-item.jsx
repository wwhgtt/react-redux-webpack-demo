const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

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
  getPropertyTypeList(item) {
    let propertyTypeList = '';
    if (item.propertyTypeList && item.propertyTypeList.length > 0) {
      item.propertyTypeList.forEach((itemt, indext) => {
        propertyTypeList += ` ${itemt.name}:`;
        itemt.properties.forEach((itemtt, indextt) => {
          propertyTypeList += `${itemtt.name},`;
        });
      });
    }
    return propertyTypeList.substring(0, propertyTypeList.length - 1);
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
            const propertyTypeList = this.getPropertyTypeList(item);
            const dishIngredientInfos = this.getDishIngredientInfos(item);
            const reprice = this.getReprice(item);
            return (
              <div className="sub-option" key={index}>
                <div className="clearfix">
                  <div className="sub-option-name ellipsis fl">
                    {item.name}
                    {item.unitName ? `/${item.unitName}` : ''}

                    <i className="sub-option-reprice">+{reprice}</i>
                  </div>
                  <div className="sub-option-number fr ellipsis">x2</div>
                </div>
                <div className="sub-option-brief ellipsis">
                {propertyTypeList} &nbsp;
                配料:{dishIngredientInfos}
                </div>
              </div>
            );
          })
        }
      </div>
    );
  },
});
