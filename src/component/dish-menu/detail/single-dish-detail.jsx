const React = require('react');
const Immutable = require('seamless-immutable');
const _findIndex = require('lodash.findindex');
const helper = require('../../../helper/dish-helper');
const DishDetailHead = require('./dish-detail-head.jsx');
const DishPropsSelect = require('./dish-props-select.jsx');
const Counter = require('../../mui/counter.jsx');
const classnames = require('classnames');
require('./single-dish-detail.scss');

module.exports = React.createClass({
  displayName: 'SingleDishDetail',
  propTypes:{
    dish: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { dish } = this.props;
    const dishForDeital = dish.setIn(
      ['order'],
      Immutable.from([{
        count:0,
        dishPropertyTypeInfos:dish.dishPropertyTypeInfos,
        dishIngredientInfos:dish.dishIngredientInfos,
      }])
    );
    return {
      dish: dishForDeital,
      toast: 0,
      ruleDish: null,
    };
  },
  componentDidMount() {
    const { dish } = this.props;
    this.onDishItemCountChange(dish.dishIncreaseUnit);
  },
  componentDidUpdate() {
  },
  onAddToCarBtnTap() {
    const { onAddToCarBtnTap } = this.props;
    const { dish } = this.state;
    if (helper.getDishesCount([dish]) > 0) {
      onAddToCarBtnTap(dish);
      return true;
    }

    this.showToast();
    return false;
  },
  onDishItemCountChange(increment) {
    const dishForDetail = this.state.dish;
    const dishForCart = this.props.dish;
    const countForDetail = helper.getDishesCount([dishForDetail]);
    const countForCart = helper.getDishesCount([dishForCart]);
    let newCountForDetail;

    if (countForDetail === 0 && countForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishForDetail.dishIncreaseUnit;
    } else if (countForCart === 0 && countForDetail + increment < dishForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = countForDetail + increment;
    }
    this.setState({ dish:dishForDetail.setIn(
      ['order', 0, 'count'],
      newCountForDetail
    ) });
  },
  onRecalcPrice(price, count) {
    return count <= 0 ? 0 : (price / count).toFixed(2);
  },
  onSelectPropsOption(propData, optionData) {
    const dishForDetail = this.state.dish;
    let propIdx = -1;
    switch (propData.type) {
      case 1:
        propIdx = _findIndex(
          dishForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dish: dishForDetail.updateIn(
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
          dishForDetail.order[0].dishPropertyTypeInfos,
          { id:propData.id }
        );
        this.setState({
          dish: dishForDetail.updateIn(
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
          dish: dishForDetail.updateIn(
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
  setDishRuleProps(id, dishOptions, immutableDish) {
    // const { setDishRuleProps } = this.props;
    const { dish } = this.state;
    this.setState({
      dish:Immutable.from(helper.setRulePropsToDishes(id, dish)),
    });
    this.setState({
      ruleDish: Immutable.from(helper.updateDishesWithRule(id, dishOptions, immutableDish)),
    });
  },
  showToast() {
    this.setState({ toast:1 });
    setTimeout(() => {
      this.setState({ toast:0 });
    }, 3000);
  },
  render() {
    const { dish, ruleDish } = this.state;
    return (
      <div className="single-dish-detail flex-columns">
        <DishDetailHead dish={dish} onCountChange={this.onDishItemCountChange} onRecalcPrice={this.onRecalcPrice} />
        <DishPropsSelect
          onSelectPropsOption={this.onSelectPropsOption} dish={dish} dishData={ruleDish || this.props.dish} onDishRuleChecked={this.setDishRuleProps}
        />
        <div className="dish-detail-addtocarta flex-none">
          <Counter count={helper.getDishesCount([dish])} onCountChange={(count, increment) => this.onDishItemCountChange(increment)} step={1} />
          <button
            className={classnames('btn--yellow', { 'btn--grey':dish.clearStatus })}
            onTouchTap={evt => { if (dish.clearStatus) { return false; } return this.onAddToCarBtnTap(); }}
          >加入购物车</button>
        </div>
        {
          this.state.toast === 1 &&
            <div className="toast"><span className="toast-content">请选择份数</span></div>
        }
      </div>
    );
  },
});
