const React = require('react');
const helper = require('../../helper/dish-hepler.js');
const classnames = require('classnames');
const BenefitOptions = require('../order/benefit-options.jsx');
require('../../component/dish-menu/cart/cart-ordered-dish.scss');
require('./ordered-dish.scss');

module.exports = React.createClass({
  displayName: 'OrderedDish',
  propTypes:{
    dish: React.PropTypes.object.isRequired,
    orderStatus:React.PropTypes.string,
    onSelectBenefit:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand : false,
    };
  },
  onExpandBtnTap(evt) {
    this.setState({ expand:!this.state.expand });
  },
  buildDetailInfo(dish) {
    if (helper.isGroupDish(dish)) {
      return this.buildDetailInfoForGroupDish(dish);
    }
    return this.buildDetailInfoForSingleDish(dish);
  },
  buildDetailInfoForSingleDish(dish) {
    const { dishPropertyTypeInfos, dishIngredientInfos } = dish.order[0];
    const RecipeProps = dishPropertyTypeInfos.filter(propInfo => propInfo.type === 1);
    const NoteProps = dishPropertyTypeInfos.filter(propInfo => propInfo.type === 3);
    function buildPropsText(propsInfo) {
      const checkedProps = propsInfo.properties.filter(props => props.isChecked);
      if (checkedProps.length > 0) {
        return `${propsInfo.name}:${checkedProps.map(props => props.name).join('、')}`;
      }
      return '';
    }
    return (
      <div className="detail-props-info">
        {
          RecipeProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText)
                     .concat(
                       [buildPropsText({ name:'配料', properties:dishIngredientInfos })].filter(propsText => propsText),
                       NoteProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText),
                     )
                     .join(' | ')
        }
      </div>
    );
  },
  buildDetailInfoForGroupDish(dish) {
    const orderedChildDishes = [].concat.apply([], dish.order[0].groups.map(
      group => helper.getOrderedDishes(group.childInfos)
    )).filter(childDish => helper.getDishesCount([childDish]));
    return (
      <div className="ordered-dish-dropdown">
      {
        orderedChildDishes.map((childDish, index) => (
          <div key={`${childDish.id}_${index}`} className="child-dish-info">
            <div className="child-dish-head">
              <span className="child-dish-name ellipsis">{childDish.unitName ? `${childDish.name}/${childDish.unitName}` : `${childDish.name}`}</span>
              {
                childDish.marketPrice !== 0 ?
                  <span className="child-dish-price badge-price">
                    {childDish.marketPrice > 0 ? '+' : ''}{childDish.marketPrice}元
                  </span> : false
              }
              {childDish.isReplace ? <span className="badge-bi"></span> : false}
              <span className="child-dish-count">{helper.getDishesCount([childDish])}</span>
              {helper.isSingleDishWithoutProps(childDish) ? false : this.buildDetailInfoForSingleDish(childDish)}
            </div>
          </div>
          ))
      }
      </div>
    );
  },
  buildDishBenefit(dish) {
    const { onSelectBenefit } = this.props;
    if (dish.order instanceof Array) {
      if (dish.order[0].benefitOptions) {
        return <BenefitOptions benefitProps={dish.order[0].benefitOptions} onSelectBenefit={onSelectBenefit} dish={dish} />;
      }
      return false;
    }
    return dish.benefitOptions ?
      <BenefitOptions benefitProps={dish.benefitOptions} onSelectBenefit={onSelectBenefit} dish={dish} />
      :
      false;
  },
  render() {
    const { dish, orderStatus } = this.props;
    const { expand } = this.state;

    let hasProps;
    if (!helper.isSingleDishWithoutProps(dish)) {
      hasProps = helper.isGroupDish(dish) ? true : helper.hasSelectedProps(dish);
    } else {
      hasProps = false;
    }
    const detailInfo = hasProps ? this.buildDetailInfo(dish) : false;

    return (
      <div className="cart-ordered-dish">
        <div className="ordered-dish">
          {
            hasProps ?
              <a
                className={classnames('ellipsis dish-name dish-name--trigger', { 'is-open':expand })}
                onTouchTap={this.onExpandBtnTap}
              >
                {helper.generateDishNameWithUnit(dish)}
              </a>
              :
              <span className="ellipsis dish-name">{helper.generateDishNameWithUnit(dish)}</span>
          }
          {orderStatus ?
            <span className={classnames('order-status', { orderStatus })}>{orderStatus}</span>
            :
            false
          }
          <span className="order-dish-price price">{helper.getDishPrice(dish)}</span>
          <span className="order-dish-count">x{helper.getDishesCount([dish])}</span>
        </div>
        {expand ? detailInfo : false}
        {this.buildDishBenefit(dish)}
      </div>
    );
  },
});
