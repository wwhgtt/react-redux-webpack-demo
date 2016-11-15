const React = require('react');
const helper = require('../../../helper/dish-helper');
const classnames = require('classnames');
const SingleDishDetail = require('./single-dish-detail.jsx');
const GroupDishDetail = require('./group-dish-detail/group-dish-detail.jsx');

require('./dish-detail-container.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  render() {
    const { dish, onAddToCarBtnTap } = this.props;
    const isGroupDish = helper.isGroupDish(dish);

    return (
      <div className={classnames('dish-detail-container', { 'single-dish-detail-all': !isGroupDish, 'group-dish-detail-all': isGroupDish })}>
        <div className="dish-detail-close" onTouchTap={this.onCloseBtnTap}>
          <a className="btn-close"></a>
        </div>
        <div className="dish-detail-content">
          {
            isGroupDish ?
              <GroupDishDetail dish={dish} onAddToCarBtnTap={onAddToCarBtnTap} /> :
              <SingleDishDetail dish={dish} onAddToCarBtnTap={onAddToCarBtnTap} />
          }
        </div>
      </div>
    );
  },
});
