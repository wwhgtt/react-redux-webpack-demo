const React = require('react');
require('./dish-detail.scss');

const DishDetail = React.createClass({
  displayName: 'DishDetail',
  propTypes: {
    mainDish: React.PropTypes.object,
  },
  render() {
    const { mainDish } = this.props;

    return (
      <div className="dish-box">
        <div className="dish-item dish-main">
          <span className="dish-name dish-main-num">{mainDish.dishName}</span>
          <span className="dish-num">{mainDish.num}</span>
          <span className="dish-price">{mainDish.price}</span>
        </div>
        <div className="dish-sub">
        {
          mainDish.subDishItems.map((item, index) =>
            <div className="dish-item" key={index}>
              <span className="dish-name dish-sub-name">{item.dishName}</span>
              <span className="dish-num">{item.num}</span>
            </div>
          )
        }
        </div>
      </div>
    );
  },
});

module.exports = DishDetail;

