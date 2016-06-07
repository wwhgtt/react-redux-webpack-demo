const React = require('react');
const helper = require('../../../../helper/dish-hepler');
const Counter = require('../../../mui/counter.jsx');

require('./group-dish-child-item.scss');

module.exports = React.createClass({
  displayName: 'GroupDishChildItem',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    onDishItemCountChange: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      expand:false,
    };
  },
  onCountChange(newCount, increament) {
    this.props.onDishItemCountChange(increament);
  },
  onPropsBtnTap(evt) {
    this.setState({ expand:!this.state.expand });
  },
  render() {
    const { dishData } = this.props;
    const { expand } = this.state;
    const hasProps = !helper.isSingleDishWithoutProps(dishData);
    return (
      <div className="group-dish-detail-item">
        <div className="dish-name">{dishData.name}<span className="badge-price">+4元</span><span className="badge-bi"></span></div>
        {
          hasProps ?
            <div className="right">
              <span className="dish-count">{dishData.order}</span>
              <a className="group-dish-dropdown-trigger btn--ellips" onTouchTap={this.onPropsBtnTap}>{expand ? '收起' : '可选属性'}</a>
            </div>
            :
            <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onCountChange} step={dishData.stepNum} />
        }
        {
          expand ?
            <div className="group-dish-dropdown">
              <div className="counter-container">
                <span className="counter-label">份数：</span>
                <Counter count={helper.getDishesCount([dishData])} onCountChange={this.onCountChange} step={dishData.stepNum} />
              </div>
            </div>
            :
            false
        }
      </div>
    );
  },
});
