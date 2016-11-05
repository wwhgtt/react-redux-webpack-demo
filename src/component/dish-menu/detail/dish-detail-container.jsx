const React = require('react');
const helper = require('../../../helper/dish-hepler');
const SingleDishDetail = require('./single-dish-detail.jsx');
const GroupDishDetail = require('./group-dish-detail/group-dish-detail.jsx');

require('./dish-detail-container.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
    setDishRuleProps: React.PropTypes.func.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  render() {
    const { dish, onAddToCarBtnTap, setDishRuleProps } = this.props;
    return (
      <div className="dish-detail-container">
        <a className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content">
          {
            helper.isGroupDish(dish) ?
              <GroupDishDetail dish={dish} onAddToCarBtnTap={onAddToCarBtnTap} /> :
              <SingleDishDetail dish={dish} onAddToCarBtnTap={onAddToCarBtnTap} setDishRuleProps={setDishRuleProps} />
          }
        </div>
      </div>
    );
  },
});
