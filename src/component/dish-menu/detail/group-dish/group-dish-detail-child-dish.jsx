const React = require('react');
const helper = require('../../../../helper/dish-hepler');
const Counter = require('../../../mui/counter.jsx');
const DishPropsSelect = require('../dish-props-select.jsx');

require('./group-dish-detail-child-dish.scss');

module.exports = React.createClass({
  displayName: 'GroupDishDetailChildDish',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    remainCount: React.PropTypes.number.isRequired,
    onDishChange: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  onCountChange(newCount, increament) {
    const { dishData, onDishItemCountChange } = this.props;
    onDishItemCountChange(dishData, increament);
  },
  onPropsBtnTap(evt) {
    this.setState({ expand:!this.state.expand });
  },
  render() {
    const { dishData, remainCount } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dishData);
    const count = helper.getDishesCount([dishData]);
    const price = helper.getDishPrice(dishData);
    return (
      <div className="group-dish-detail-child-dish">
        <div className="dish-name">
          {dishData.name}
          <span className="badge-price">{price}元</span>
          {dishData.isReplace ? <span className="badge-bi"></span> : false}
        </div>
        {
          hasProps ?
            <div className="right">
              <span className="dish-count">{count}</span>
              <a className="group-dish-dropdown-trigger btn--ellips" onTouchTap={this.onPropsBtnTap}>{expand ? '收起' : '可选属性'}</a>
            </div>
            :
            <Counter
              count={count}
              maximum={dishData.isMulti ? count + remainCount : 1} minimum={dishData.isReplace ? dishData.leastCellNum : 0}
              onCountChange={this.onCountChange}
            />
        }
        {
          expand ?
            <div className="group-dish-dropdown">
              <div className="counter-container">
                <span className="counter-label">份数：</span>
                <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onCountChange} />
              </div>
              <DishPropsSelect
                propsData={dishData.order[0].dishPropertyTypeInfos} ingredientsData={dishData.order[0].dishIngredientInfos}
                onSelectPropsOption={this.onSelectPropsOption}
              />
            </div>
            :
            false
        }
      </div>
    );
  },
});
