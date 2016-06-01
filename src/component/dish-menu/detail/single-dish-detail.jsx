const React = require('react');
const _cloneDeep = require('lodash.clonedeep');
const helper = require('../../../helper/dish-hepler');
const DishDetailItem = require('./dish-detail-item.jsx');
const DishPropsSelect = require('./dish-props-select.jsx');
module.exports = React.createClass({
  displayName: 'SingleDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    const dishDataForState = _cloneDeep(this.props.dishData);
    if (dishDataForState.order === undefined) {
      dishDataForState.order = [
        {
          count:0,
          dishPropertyTypeInfos:dishDataForState.dishPropertyTypeInfos,
          dishIngredientInfos:dishDataForState.dishIngredientInfos,
        },
      ];
    }
    return {
      dishData: dishDataForState,
    };
  },
  componentDidUpdate() {
  },
  onDishItemCountChange(increament) {
    const oldDishData = this.state.dishData;
    const oldOrderData = oldDishData.order;
    const oldCount = helper.getDishesCount([oldDishData]);
    let newCount;
    if (oldCount === 0) {
      newCount = oldDishData.dishIncreaseUnit;
    } else if (oldCount + increament < oldDishData.dishIncreaseUnit) {
      newCount = 0;
    } else {
      newCount = oldCount + increament;
    }
    const newOrderData = [Object.assign({}, oldOrderData[0], { count: newCount })];
    this.setState({ dishData: Object.assign({}, oldDishData, { order:newOrderData }) });
  },
  onSelectPropsOption(propData, optionData) {
    const oldDishData = this.state.dishData;
    const oldOrderData = oldDishData.order;
    const oldPropsData = oldOrderData[0].dishPropertyTypeInfos;
    let newOrderData = [];
    let newPropsData = {};
    let newPropData = {};
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
        break;
      default:

    }
    newPropsData = oldPropsData.map(prop => prop.id === newPropData.id ? newPropData : prop);
    newOrderData[0] = Object.assign({}, oldOrderData[0], { dishPropertyTypeInfos:newPropsData });
    this.setState({ dishData: Object.assign({}, oldDishData, { order:newOrderData }) });
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
        <button className="dish-detail-addtocart btn--yellow">加入购物车</button>
      </div>
    );
  },
});
