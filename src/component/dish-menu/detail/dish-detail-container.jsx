const React = require('react');
const helper = require('../../../helper/dish-hepler');
const SingleDishDetail = require('./single-dish-detail.jsx');
const GroupDishDetail = require('./group-dish-detail.jsx');

require('./dish-detail-container.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  render() {
    const { dishData } = this.props;
    return (
      <div className="dish-detail-container">
        <a href="" className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content">
          {helper.isGroupDish(dishData) ? <GroupDishDetail /> : <SingleDishDetail dishData={dishData} />}
        </div>
      </div>
    );
  },
});
