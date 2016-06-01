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
    const dishDataForState = _cloneDeep(this.props.dishData);

    dishDataForState.order = [
      {
        count:0,
        dishPropertyTypeInfos:dishDataForState.dishPropertyTypeInfos,
        dishIngredientInfos:dishDataForState.dishIngredientInfos,
      },
    ];

    return {
      dishData: dishDataForState,
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
  onDishItemCountChange(increament) {
    const dishDataForDetail = this.state.dishData;
    const dishDataForCart = this.props.dishData;
    const orderDataForDetail = dishDataForDetail.order;
    const countForDetail = helper.getDishesCount([dishDataForDetail]);
    const countForCart = helper.getDishesCount([dishDataForCart]);
    let newCountForDetail;

    if (countForDetail === 0 && countForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishDataForDetail.dishIncreaseUnit;
    } else if (countForCart === 0 && countForDetail + increament < dishDataForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = countForDetail + increament;
    }
    const newOrderData = [Object.assign({}, orderDataForDetail[0], { count: newCountForDetail })];
    this.setState({ dishData: Object.assign({}, dishDataForDetail, { order:newOrderData }) });
  },
  onSelectPropsOption(propData, optionData) {
    const dishDataForDetail = this.state.dishData;
    const orderDataForDetail = dishDataForDetail.order;
    const oldPropsData = orderDataForDetail[0].dishPropertyTypeInfos;
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
    newOrderData[0] = Object.assign({}, orderDataForDetail[0], { dishPropertyTypeInfos:newPropsData });
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
