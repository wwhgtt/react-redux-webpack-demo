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
        <a href="" className="dish-detail-close" onTouchTap={this.onCloseBtnTap}></a>
        <div className="dish-detail-content">
          <img className="memberdish-image" src={dish.largeImgUrl || imagePlaceholder} alt="" />
          <div className="memberdish-content">
            <h2 className="memberdish-title">{dish.name}</h2>
            <p className="clearfix">
              <span className="memberdish-price--small price">{dish.marketPrice}</span>
              <span className="memberdish-price--large price">28</span>
            </p>
            <h3 className="memberdish-subtitle">美食简介</h3>
            <p className="memberdish-desc">{dish.dishDesc}</p>
          </div>
        </div>
      </div>
    );
  },
});
