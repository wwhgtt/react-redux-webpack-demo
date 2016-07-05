const React = require('react');
const helper = require('../../helper/dish-hepler.js');
const classnames = require('classnames');
require('../../component/dish-menu/cart/cart-ordered-dish.scss');
require('./ordered-dish.scss');

module.exports = React.createClass({
  displayName: 'CartOrderedDish',
  propTypes:{
    dish: React.PropTypes.object.isRequired,
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
      <div className="ordered-dish-dropdown">
        <span className="detail-props-info">
          {
            RecipeProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText)
            .concat(
              [buildPropsText({ name:'配料', properties:dishIngredientInfos })].filter(propsText => propsText),
              NoteProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText),
            )
            .join('|')
        }
        </span>
      </div>
    );
  },
  buildDetailInfoForGroupDish(dish) {
    const orderedChildDishes = [].concat.apply([], dish.order[0].groups.map(
      group => helper.getOrderedDishes(group.childInfos)
    ));
    return (
      <div className="ordered-dish-dropdown">
      {
        orderedChildDishes.map(childDish => (
          <div key={childDish.id} className="child-dish-info">
            <div className="child-dish-head">
              <span className="child-dish-name ellipsis">{childDish.name}</span>
              <span className="child-dish-price badge-price">{helper.getDishPrice(childDish)}元</span>
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
  render() {
    const { dish } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dish);
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
                {dish.name}
              </a>
              :
              <span className="ellipsis dish-name">{dish.name}</span>
          }
          <span className="order-dish-price price">{helper.getDishPrice(dish)}</span>
          <span className="order-dish-count">x{helper.getDishesCount([dish])}</span>
        </div>
        {expand ? detailInfo : false}
      </div>
    );
  },
});
