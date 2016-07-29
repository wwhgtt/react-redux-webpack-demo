const React = require('react');
const imagePlaceholder = require('../../../asset/images/dish-placeholder-large.png');

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
  render() {
    const { dish } = this.props;
    return (
      <div className="dish-detail-container">
        <a className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content dish-detail-content--white">
          <img className="dish-desc-image" src={dish.largeImgUrl || imagePlaceholder} alt="" />
          <div className="dish-desc-content">
            <h2 className="dish-desc-title">{dish.name}</h2>
            {dish.memberPrice ?
              <p className="clearfix">
                <span className="dish-desc-price--del price">{dish.marketPrice}</span>
                <span className="dish-desc-price-title">会员价:</span>
                <span className="dish-desc-price--bold price">{dish.memberPrice}</span>
              </p>
              : <p className="clearfix"><span className="dish-desc-price--bold price">{dish.marketPrice}</span></p>
            }
            <h3 className="dish-desc-subtitle">美食简介</h3>
            <p className="dish-desc-desc">{dish.dishDesc}</p>
          </div>
        </div>
      </div>
    );
  },
});
