const React = require('react');
const Immutable = require('seamless-immutable');
const _findIndex = require('lodash.findindex');
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
    const { dishData } = this.props;
    const dishDataForDeital = dishData.setIn(
      ['order'],
      Immutable.from([{
        count:0,
        dishPropertyTypeInfos:dishData.dishPropertyTypeInfos,
        dishIngredientInfos:dishData.dishIngredientInfos,
      }])
    );
    return {
      dishData: dishDataForDeital,
    };
  },
  componentDidUpdate() {
  },
  onAddToCarBtnTap() {
    const { onAddToCarBtnTap } = this.props;
    const { dishData } = this.state;
    if (dishData.order[0].count > 0) {
      onAddToCarBtnTap(dishData);
      return true;
    }
    return false;
  },
  onDishItemCountChange(increment) {
    const dishDataForDetail = this.state.dishData;
    const dishDataForCart = this.props.dishData;
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
    this.setState({ dishData:dishDataForDetail.setIn(
      ['order', 0, 'count'],
      newCountForDetail
    ) });
  },
  onSelectPropsOption(propData, optionData) {
    const dishDataForDetail = this.state.dishData;
    let propIdx = -1;
    switch (propData.type) {
      case 1:
        propIdx = _findIndex(
          dishDataForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              } else if (option.id !== optionData.id && option.isChecked === true) {
                return option.set('isChecked', false);
              }
              return option;
            })
          ),
        });
        break;
      case 3:
        propIdx = _findIndex(
          dishDataForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishPropertyTypeInfos', propIdx, 'properties'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        });
        break;
      case -1: // this is a client workround for ingredientsData, we don't have this value of type on serverside
        this.setState({
          dishData: dishDataForDetail.updateIn(
            ['order', 0, 'dishIngredientInfos'],
            options => options.flatMap(option => {
              if (option.id === optionData.id) {
                return option.set('isChecked', !option.isChecked);
              }
              return option;
            })
          ),
        });
        break;
      default:
    }
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
