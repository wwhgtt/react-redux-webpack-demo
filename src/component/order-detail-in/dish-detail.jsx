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
  handleStatus() {
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
  render() {
    const { mainDish } = this.props;
    const { expand } = this.state;
    let hasChild = false;
    hasChild = this.handleHasChild();
    let statusType = '';
    statusType = this.handleStatus();
    return (
      <div className="option">
        <div className="dish-box">
          <div className="dish-main">
            <a
              className={classnames('ellipsis dish-name', { 'dish-name--trigger': hasChild }, { 'is-open': expand })}
              onTouchTap={this.handleExpand}
            >{mainDish.dishName}</a>
            <span className="dish-price price ellipsis">{mainDish.price}</span>
            <span className="dish-count ellipsis">x{mainDish.num}</span>
            {
              mainDish.memo && !mainDish.subDishItems && expand
              ?
                <p className="dish-memo">{mainDish.memo}</p>
              : ''
            }
            <div className={'dish-status status-square ' + statusType}></div>
          </div>
          {
            expand && mainDish.subDishItems ?
              <div className="dish-sub">
              {
                mainDish.subDishItems ?
                mainDish.subDishItems.map((item, index) =>
                  <div className="dish-sub-info" key={index}>
                    <span className="dish-name ellipsis">{item.dishName}</span>
                    {
                      item.propertyAmount ?
                        <span className="badge-price">+{item.propertyAmount}元</span>
                      : ''
                    }
                    <span className="dish-count ellipsis">x{item.num}</span>
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

