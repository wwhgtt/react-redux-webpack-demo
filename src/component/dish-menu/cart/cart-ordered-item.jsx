const React = require('react');
const Counter = require('../../mui/counter.jsx');
const helper = require('../../../helper/dish-hepler');
const classnames = require('classnames');
require('./cart-ordered-item.scss');

module.exports = React.createClass({
  displayName: 'CartOrderedItem',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onOrderBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand : false,
    };
  },
  onOrderBtnTap(newCount, increment) {
    const { dishData, onOrderBtnTap } = this.props;
    if (helper.isSingleDishWithoutProps(dishData)) {
      onOrderBtnTap(dishData, increment);
    } else {
      onOrderBtnTap(dishData.updateIn(
        ['order', 0, 'count'],
        count => helper.getNewCountOfDish(dishData, increment) - count
      ));
    }
  },
  onExpandBtnTap(evt) {
    this.setState({ expand:!this.state.expand });
  },
  buildDetailInfo(dishData) {
    const { dishPropertyTypeInfos, dishIngredientInfos } = dishData.order[0];
    const RecipeProps = dishPropertyTypeInfos.filter(propInfo => propInfo.type === 1);
    const NoteProps = dishPropertyTypeInfos.filter(propInfo => propInfo.type === 3);
    function buildPropsText(propsInfo) {
      const checkedProps = propsInfo.properties.filter(props => props.isChecked);
      if (checkedProps.length > 0) {
        return `${propsInfo.name}:${checkedProps.map(props => props.name).join('、')}`;
      }
      return '';
    }

    if (helper.isGroupDish(dishData)) {
      // TODO
    }
    return (
      <div className="ordered-item-dropdown">
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
  render() {
    const { dishData } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dishData);
    const detailInfo = hasProps ? this.buildDetailInfo(dishData) : false;
    return (
      <div className="cart-ordered-item">
        <div className="ordered-item">
          {
            hasProps ?
              <a
                className={classnames('ellipsis dish-name dish-name--trigger', { 'is-open':expand })}
                onTouchTap={this.onExpandBtnTap}
              >
                {dishData.name}
              </a>
              :
              <span className="ellipsis dish-name">{dishData.name}</span>
          }
          <span className="dish-price price">{helper.getDishPrice(dishData)}</span>
          <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onOrderBtnTap} step={dishData.stepNum} />
        </div>
        {expand ? detailInfo : false}
      </div>
    );
  },
});
