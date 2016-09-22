const React = require('react');
const classnames = require('classnames');

require('./dish-detail.scss');

const DishDetail = React.createClass({
  displayName: 'DishDetail',
  propTypes: {
    mainDish: React.PropTypes.object,
  },
  getInitialState() {
    return {
      expand : false, // 是否展开
    };
  },
  handleExpand() {
    const { mainDish } = this.props;
    if (mainDish.memo || mainDish.subDishItems) {
      this.setState({ expand:!this.state.expand });
    }
  },
  handleHasChild() {
    const { mainDish } = this.props;
    let hasChild = false;
    if (mainDish.memo || mainDish.subDishItems) {
      hasChild = true;
    }
    return hasChild;
  },
  render() {
    const { mainDish } = this.props;
    const { expand } = this.state;
    let hasChild = false;
    hasChild = this.handleHasChild();
    return (
      <div className="option">
        <div className="dish-box">
          <div className="dish-main">
            <a
              className={classnames('ellipsis dish-name', { 'dish-name--trigger': hasChild }, { 'is-open': expand })}
              onTouchTap={this.handleExpand}
            >{mainDish.dishName}</a>
            <span className="dish-price price ellipsis">{mainDish.price}</span>
            <span className="dish-count ellipsis">{mainDish.num}</span>
            {
              mainDish.memo && !mainDish.subDishItems && expand
              ?
                <p className="dish-memo">{mainDish.memo}</p>
              : ''
            }
          </div>
          {
            expand && mainDish.subDishItems ?
              <div className="dish-sub">
              {
                mainDish.subDishItems ?
                mainDish.subDishItems.map((item, index) =>
                  <div className="dish-sub-info" key={index}>
                    <span className="dish-name ellipsis">{item.dishName}</span>
                    <span className="dish-count ellipsis">{item.num}</span>
                    {
                      item.memo ?
                        <p className="dish-memo">{item.memo}</p>
                      : ''
                    }
                  </div>
                ) : ''
              }
              </div>
            : ''
          }
        </div>
      </div>
    );
  },
});

module.exports = DishDetail;

