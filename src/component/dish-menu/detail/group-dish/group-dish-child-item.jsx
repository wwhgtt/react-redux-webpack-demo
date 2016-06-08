const React = require('react');
const helper = require('../../../../helper/dish-hepler');
const Counter = require('../../../mui/counter.jsx');

require('./group-dish-child-item.scss');

module.exports = React.createClass({
  displayName: 'GroupDishChildItem',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    remainCount: React.PropTypes.number.isRequired,
    minCount: React.PropTypes.number.isRequired,
    onDishItemCountChange: React.PropTypes.func.isRequired,
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
    const { dishData, minCount, remainCount } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dishData);
    const count = helper.getDishesCount([dishData]);
    const price = helper.getDishPrice(dishData);
    return (
      <div className="group-dish-detail-item">
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
            <Counter count={count} maximum={count + remainCount} minimum={minCount} onCountChange={this.onCountChange} />
        }
        {
          expand ?
            <div className="group-dish-dropdown">
              <div className="counter-container">
                <span className="counter-label">份数：</span>
                <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onCountChange} />
              </div>
            </div>
            :
            false
        }
      </div>
    );
  },
});
