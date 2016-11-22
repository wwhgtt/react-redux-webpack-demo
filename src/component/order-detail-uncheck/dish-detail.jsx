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
  getDishState() {
    const { mainDish } = this.props;
    const dishStatus = mainDish.status;
    let statusType = '';
    if (dishStatus === 1) {
      statusType = 'status-square-uncheck';
    } else if (dishStatus === 2) {
      statusType = 'status-square-checked';
    } else if (dishStatus === 3) {
      statusType = 'status-square-refused';
    }
    return statusType;
  },
  handleExpand() {
    const { mainDish } = this.props;
    if (mainDish.memo || mainDish.subDishItems) {
      this.setState({ expand:!this.state.expand });
    }
  },
  isHasChild() {
    const { mainDish } = this.props;
    const hasChild = mainDish.memo || mainDish.subDishItems;
    return hasChild;
  },
  render() {
    const { mainDish } = this.props;
    const { expand } = this.state;
    const isHasChild = this.isHasChild();
    const statusType = this.getDishState();
    return (
      <div className="option">
        <div className="dish-box">
          <div className="dish-main clearfix" onTouchTap={this.handleExpand}>
            <a
              className={classnames('ellipsis dish-name',
                {
                  'dish-name--trigger': isHasChild,
                  'is-open': expand,
                  'dish-name-long': !statusType,
                }
                )
              }
            >
            {mainDish.dishName}
            </a>
            <span className="dish-price price ellipsis">{mainDish.price < 0 ? 0 : mainDish.price}</span>
            <span
              className={classnames('dish-count ellipsis',
                {
                  'dish-count-short': !statusType,
                }
                )
              }
            >
              x{mainDish.num}
            </span>
            {
              mainDish.memo && !mainDish.subDishItems && expand && <p className="dish-memo">{mainDish.memo}</p>
            }
            <div className={`dish-status status-square ${statusType}`}></div>
          </div>
          {
            expand && mainDish.subDishItems ?
              <div className="dish-sub">
              {
                mainDish.subDishItems ?
                mainDish.subDishItems.map((item, index) =>
                  <div className="dish-sub-info clearfix" key={index}>
                    <span className="dish-name ellipsis">{item.dishName}</span>
                    {
                      item.propertyAmount ?
                        <span className="badge-price">{item.propertyAmount > 0 ? '+' : ''}{item.propertyAmount}元</span>
                      : ''
                    }
                    <span className="dish-count ellipsis">x{item.num}</span>
                    {
                      item.memo && <p className="dish-memo">{item.memo}</p>
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

