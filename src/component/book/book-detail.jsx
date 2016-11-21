const React = require('react');
const classnames = require('classnames');
const helper = require('../../helper/dish-helper');
require('./book-detail.scss');

const BookDetail = React.createClass({
  displayName: 'BookDetail',
  propTypes: {
    mainDish: React.PropTypes.object,
  },
  getInitialState() {
    return {
      expand : false, // 是否展开
    };
  },
  handleExpand(hasProps) {
    if (hasProps) {
      this.setState({ expand:!this.state.expand });
    }
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
        return `${propsInfo.name}: ${checkedProps.map(props => props.name).join('、')}`;
      }
      return '';
    }
    return (
      <p className="dish-memo">
        {
          RecipeProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText)
                     .concat(
                       [buildPropsText({ name:'配料', properties:dishIngredientInfos })].filter(propsText => propsText),
                       NoteProps.map(propInfo => (buildPropsText(propInfo))).filter(propsText => propsText),
                     )
                     .join(' | ')
        }
      </p>
    );
  },
  buildDetailInfoForGroupDish(dish) {
    const orderedChildDishes = [].concat.apply([], dish.order[0].groups.map(
      group => helper.getOrderedDishes(group.childInfos)
    )).filter(childDish => helper.getDishesCount([childDish]));
    return (
      <div className="dish-sub">
      {
        orderedChildDishes.map((item, index) =>
          <div className="dish-sub-info clearfix" key={index}>
            <span className="dish-name ellipsis">{item.unitName ? `${item.name}/${item.unitName}` : `${item.name}`}</span>
            {
              item.marketPrice && item.marketPrice !== 0 ?
                <span className="badge-price">{item.marketPrice > 0 ? '+' : ''}{item.marketPrice}元</span>
              : ''
            }
            <span className="dish-count ellipsis">x{helper.getDishesCount([item])}</span>
            {
              !helper.isSingleDishWithoutProps(item) && <p className="dish-memo">{this.buildDetailInfoForSingleDish(item)}</p>
            }
          </div>
        )
      }
      </div>
    );
  },
  render() {
    const { mainDish } = this.props;
    const { expand } = this.state;
    // const orderedChildDishes = this.buildDetailInfo(mainDish);
    let hasProps;
    if (!helper.isSingleDishWithoutProps(mainDish)) {
      hasProps = helper.isGroupDish(mainDish) ? true : helper.hasSelectedProps(mainDish);
    } else {
      hasProps = false;
    }
    const detailInfo = hasProps ? this.buildDetailInfo(mainDish) : false;

    return (
      <div className="option">
        <div className="dish-box">
          <div className="dish-main clearfix" onTouchTap={() => this.handleExpand(hasProps)}>
            <a
              className={classnames('ellipsis dish-name', { 'dish-name--trigger': hasProps }, { 'is-open': expand })}
            >{helper.generateDishNameWithUnit(mainDish)}</a>
            <span className="dish-price price ellipsis">{helper.getDishPrice(mainDish)}</span>
            <span className="dish-count ellipsis">x{helper.getDishesCount([mainDish])}</span>
          </div>
          {
            expand && hasProps ?
              <div>
                {detailInfo}
              </div>
            : ''
          }
        </div>
      </div>
    );
  },
});

module.exports = BookDetail;

