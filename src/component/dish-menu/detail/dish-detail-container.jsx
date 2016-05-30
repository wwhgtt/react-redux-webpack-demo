const React = require('react');
const helper = require('../../../helper/dish-hepler');
const SingleDishDetail = require('./single-dish-detail.jsx');
const GroupDishDetail = require('./group-dish-detail.jsx');
module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
  },
  render() {
    const { onCloseBtnTap, dishData } = this.props;
    return (
      <div className="dish-detail-container">
        <a href="" className="close-btn" onTouchTap={onCloseBtnTap}></a>
        {helper.isGroupDish(dishData) ? <GroupDishDetail /> : <SingleDishDetail dishData={dishData} />}
      </div>
    );
  },
});
