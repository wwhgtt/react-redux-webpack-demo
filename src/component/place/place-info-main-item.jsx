const React = require('react');
require('./place-info-main-item.scss');
const shallowCompare = require('react-addons-shallow-compare');
const PlaceInfoSubItem = require('./place-info-sub-item.jsx');
const classnames = require('classnames');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'PlaceInfoMainItem',
  propTypes:{
    mainDish: React.PropTypes.object,
    setPrice: React.PropTypes.func,
    setNumber: React.PropTypes.func,
  },
  getInitialState() {
    return { expand:false };
  },
  componentWillMount() { },
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getMainPrice(mainDish) {
    const { setPrice } = this.props;
    if (mainDish) {
      const mainPrice = mainDish.marketPrice * mainDish.num;
      let value = 0;
      // propertyTypeList
      if (mainDish.propertyTypeList && mainDish.propertyTypeList.length > 0) {
        mainDish.propertyTypeList.forEach((item, index) => {
          item.properties.forEach((itemt, indext) => {
            value += itemt.reprice;
          });
        });
      }
      // dishIngredientInfos
      if (mainDish.dishIngredientInfos && mainDish.dishIngredientInfos.length > 0) {
        mainDish.dishIngredientInfos.forEach((item, index) => {
          value += item.reprice;
        });
      }

      switch (mainDish.type) {
        case 0: { // 单菜
          break;
        }
        case 1: { // 套餐
          if (mainDish.subDishItems && mainDish.subDishItems.length > 0) {
            mainDish.subDishItems.forEach((item, index) => {
              value += item.marketPrice * item.num;
              if (item.propertyTypeList && item.propertyTypeList.length > 0) {
                item.propertyTypeList.forEach((itemt, indext) => {
                  itemt.properties.forEach((itemtt, indextt) => {
                    value += itemtt.reprice;
                  });
                });
                item.dishIngredientInfos.forEach((itemt, indext) => {
                  value += itemt.reprice;
                });
              }
            });
          }
          break;
        }
        default:break;
      }
      setPrice((mainPrice + value).toFixed(2));
      return (mainPrice + value).toFixed(2);
    }
    return 0;
  },
  getMainNum(mainDish) {
    const { setNumber } = this.props;
    setNumber(mainDish.num || 0);
    return mainDish.num || 0;
  },
  setExpand() {
    const { expand } = this.state;
    if (!expand) {
      this.setState({ expand: true });
    } else {
      this.setState({ expand: false });
    }
  },
  getMainPropertyTypeBrief(mainDish) {
    let propertyTypeList = '';

    if (mainDish.propertyTypeList && mainDish.propertyTypeList.length > 0) {
      mainDish.propertyTypeList.forEach((itemt, indext) => {
        propertyTypeList += ` ${itemt.name}:`;
        itemt.properties.forEach((itemtt, indextt) => {
          propertyTypeList += `${itemtt.name},`;
        });
      });
    }

    return (
      propertyTypeList.substring(0, propertyTypeList.length - 1)
    );
  },
  getMainDishIngredientBrief(mainDish) {
    let dishIngredientInfos = '';

    if (mainDish.dishIngredientInfos && mainDish.dishIngredientInfos.length > 0) {
      mainDish.dishIngredientInfos.forEach((itemt, indext) => {
        dishIngredientInfos += `${itemt.name},`;
      });
    }

    return (
      dishIngredientInfos.substring(0, dishIngredientInfos.length - 1)
    );
  },
  getArrowStatus(mainDishType, hasPropertyTypeList, hasDishIngredientInfos, hasSubDishItems) {
    if (mainDishType === 1) {
      if (hasSubDishItems) {
        return true;
      }
      return false;
    } else if (mainDishType === 0) {
      if (hasPropertyTypeList || hasDishIngredientInfos) {
        return true;
      }
      return false;
    }
    return false;
  },
  render() {
    const { mainDish } = this.props;
    const { expand } = this.state;
    const mainPrice = this.getMainPrice(mainDish);
    const mainNum = this.getMainNum(mainDish);
    const getMainPropertyTypeBrief = this.getMainPropertyTypeBrief(mainDish);
    const getMainDishIngredientBrief = this.getMainDishIngredientBrief(mainDish);
    const hasPropertyTypeList = mainDish.propertyTypeList && mainDish.propertyTypeList.length > 0;
    const hasDishIngredientInfos = mainDish.dishIngredientInfos && mainDish.dishIngredientInfos.length > 0;
    const hasSubDishItems = mainDish.subDishItems && mainDish.subDishItems.length > 0;
    const noArrow = this.getArrowStatus(mainDish.type, hasPropertyTypeList, hasDishIngredientInfos, hasSubDishItems);

    return (
      <div className="option" onTouchTap={this.setExpand}>
        <div className="option-price price ellipsis fr">{mainPrice}</div>
        <div className="option-number ellipsis fr">x{mainNum}</div>
        <div
          className={classnames('option-name ellipsis',
            { 'option-name-expand':expand,
              'option-name-noarrow':!noArrow,
            })}
        >
          {mainDish.name}
          {mainDish.unitName ? `/${mainDish.unitName}` : ''}
        </div>
        {
          expand && mainDish.type === 0 && (hasPropertyTypeList || hasDishIngredientInfos) && (
            <div className="option-brief ellipsis">
              {getMainPropertyTypeBrief} &nbsp;
              配料:{getMainDishIngredientBrief}
            </div>
          )
        }
        {
          expand && mainDish.type === 1 && hasSubDishItems && (
            <PlaceInfoSubItem subDishItemList={mainDish.subDishItems} />
          )
        }
      </div>
    );
  },
});
