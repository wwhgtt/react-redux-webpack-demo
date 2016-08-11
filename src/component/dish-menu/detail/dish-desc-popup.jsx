const React = require('react');
const imagePlaceholder = require('../../../asset/images/dish-placeholder-large.png');
const helper = require('../../../helper/dish-hepler');

require('./dish-detail-container.scss');
require('./dish-desc-popup.scss');

module.exports = React.createClass({
  displayName: 'DishDetailContainer',
  propTypes: {
    dish: React.PropTypes.object.isRequired,
    onCloseBtnTap: React.PropTypes.func.isRequired,
  },
  onCloseBtnTap(evt) {
    evt.preventDefault();
    this.props.onCloseBtnTap();
  },
  buildDishName(dishData) {
    if (helper.isSingleDishWithoutProps(dishData) && Array.isArray(dishData.dishPropertyTypeInfos) && dishData.dishPropertyTypeInfos.length) {
      const properties = dishData.dishPropertyTypeInfos.map(prop => prop.properties[0].name).join(', ');
      return `${dishData.name} ${properties}/${dishData.unitName}`;
    }
    return dishData.name;
  },
  render() {
    const { dish } = this.props;
    const dishName = this.buildDishName(dish);

    let memberPrice;
    if (dish.isMember && dish.discountType === 1) {
      // dish.memberPrice = discount, e.g. 5 means 50% discount
      memberPrice = dish.marketPrice * dish.memberPrice * 0.1;
    } else if (dish.isMember && dish.discountType === 2) {
      memberPrice = dish.memberPrice;
    }

    return (
      <div className="dish-detail-container">
        <a className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content dish-detail-content--white">
          <img className="dish-desc-image" src={dish.largeImgUrl || imagePlaceholder} alt="" />
          <div className="dish-desc-content">
            <h2 className="dish-desc-title">{dishName}</h2>
            {dish.isMember ?
              <p className="clearfix">
                <span className="dish-desc-price--del price">{dish.marketPrice}</span>
                <span className="dish-desc-price-title">会员价:</span>
                <span className="dish-desc-price--bold price">{memberPrice}</span>
              </p>
              : <p className="clearfix"><span className="dish-desc-price--bold price">{dish.marketPrice.toFixed(2)}</span></p>
            }
            <h3 className="dish-desc-subtitle">美食简介</h3>
            <p className="dish-desc-desc">{dish.dishDesc}</p>
          </div>
        </div>
      </div>
    );
  },
});
