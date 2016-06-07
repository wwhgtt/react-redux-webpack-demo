const React = require('react');
const _cloneDeep = require('lodash.clonedeep');
const helper = require('../../../helper/dish-hepler');
const DishDetailItem = require('./dish-detail-item.jsx');
const DishPropsSelect = require('./dish-props-select.jsx');
module.exports = React.createClass({
  displayName: 'SingleDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const dishDataForDeital = _cloneDeep(this.props.dishData);

    dishDataForDeital.order = [
      {
        count:0,
        dishPropertyTypeInfos:dishDataForDeital.dishPropertyTypeInfos,
        dishIngredientInfos:dishDataForDeital.dishIngredientInfos,
      },
    ];

    return {
      dishData: dishDataForDeital,
    };
  },
  componentDidUpdate() {
  },
  onAddToCarBtnTap() {
    const { onAddToCarBtnTap } = this.props;
    const { dishData } = this.state;
    const dishOrderData = dishData.order[0];
    if (dishOrderData.count > 0) {
      onAddToCarBtnTap(dishData);
      return true;
    }
    return false;
  },
  onDishItemCountChange(increment) {
    const dishDataForDetail = this.state.dishData;
    const dishDataForCart = this.props.dishData;
    const orderDataForDetail = dishDataForDetail.order;
    const countForDetail = helper.getDishesCount([dishDataForDetail]);
    const countForCart = helper.getDishesCount([dishDataForCart]);
    let newCountForDetail;

    if (countForDetail === 0 && countForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishDataForDetail.dishIncreaseUnit;
    } else if (countForCart === 0 && countForDetail + increment < dishDataForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = countForDetail + increment;
    }
    const newOrderData = [Object.assign({}, orderDataForDetail[0], { count: newCountForDetail })];
    this.setState({ dishData: Object.assign({}, dishDataForDetail, { order:newOrderData }) });
  },
  onSelectPropsOption(propData, optionData) {
    const dishDataForDetail = this.state.dishData;
    const orderDataForDetail = dishDataForDetail.order;
    const oldPropsData = orderDataForDetail[0].dishPropertyTypeInfos;
    const oldIngredientData = orderDataForDetail[0].dishIngredientInfos;
    let newOrderData = [];
    let newPropsData = oldPropsData;
    let newPropData = {};
    let newIngredientData = oldIngredientData;
    switch (propData.type) {
      case 1:
        newPropData = Object.assign({}, propData, {
          properties: propData.properties.map(prop => {
            if (prop.id === optionData.id) {
              return Object.assign({}, prop, { isChecked:!prop.isChecked });
            }
            if (prop.id !== optionData.id && prop.isChecked === true) {
              return Object.assign({}, prop, { isChecked:!prop.isChecked });
            }
            return prop;
          }),
        });
        newPropsData = oldPropsData.map(prop => prop.id === newPropData.id ? newPropData : prop);
        break;
      case 3:
        newPropData = Object.assign({}, propData, {
          properties: propData.properties.map(prop => {
            if (prop.id === optionData.id) {
              return Object.assign({}, prop, { isChecked:!prop.isChecked });
            }
            return prop;
          }),
        });
        newPropsData = oldPropsData.map(prop => prop.id === newPropData.id ? newPropData : prop);
        break;
      case -1: // this is a client workround for ingredientsData, we don't have this value of type on serverside
        newIngredientData = oldIngredientData.map(ingredientData => {
          if (ingredientData.id === optionData.id) {
            return Object.assign({}, ingredientData, { isChecked: !ingredientData.isChecked });
          }
          return ingredientData;
        });
        break;
      default:

    }
    newOrderData[0] = Object.assign({}, orderDataForDetail[0], { dishPropertyTypeInfos:newPropsData }, { dishIngredientInfos:newIngredientData });
    this.setState({ dishData: Object.assign({}, dishDataForDetail, { order:newOrderData }) });
  },
  render() {
    const { dishData } = this.state;
    return (
      <div className="single-dish-detail">
        <DishDetailItem dishData={dishData} onCountChange={this.onDishItemCountChange} />
        <DishPropsSelect
          propsData={dishData.order[0].dishPropertyTypeInfos} ingredientsData={dishData.order[0].dishIngredientInfos}
          onSelectPropsOption={this.onSelectPropsOption}
        />
        <button className="dish-detail-addtocart btn--yellow" onTouchTap={this.onAddToCarBtnTap}>加入购物车</button>
      </div>
    );
  },
});
