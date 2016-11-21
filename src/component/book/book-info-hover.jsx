const React = require('react');
const shallowCompare = require('react-addons-shallow-compare');

const BookInfoMainItem = require('./book-info-main-item.jsx');

require('./book-info-hover.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'BookInfoHover',
  propTypes:{
    bookQueueItemList:React.PropTypes.array,
    setHoverState:React.PropTypes.func,
    clearBookQueueInfo:React.PropTypes.func,
    bookQueueMemo:React.PropTypes.string,
  },
  getInitialState() {
    return { totalPrice:0, totalNum:0 };
  },
  componentWillMount() {
    this.arrayPrice = [];
    this.arrayNum = [];
  },
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getEveryPrice(price) {
    this.arrayPrice.push(+price);
    if (this.arrayPrice.length === this.props.bookQueueItemList.length) {
      setTimeout(() => {
        this.setState({ totalPrice:this.arrayPrice.reduce((a, b) => a + b) });
      }, 500);
    }
  },
  getEveryNum(num) {
    this.arrayNum.push(+num);
    if (this.arrayNum.length === this.props.bookQueueItemList.length) {
      setTimeout(() => {
        this.setState({ totalNum:this.arrayNum.reduce((a, b) => a + b) });
      }, 500);
    }
  },
  closeHover(bool, e) {
    e.preventDefault();
    const { setHoverState } = this.props; // clearBookQueueInfo
    setHoverState(bool);
    // clearBookQueueInfo({});
  },
  render() {
    const { bookQueueItemList, bookQueueMemo } = this.props;
    const { totalPrice, totalNum } = this.state;
    return (
      <div className="float-layer">
        <div className="float-layer-hover" onTouchTap={(e) => this.closeHover(false, e)}></div>
        <div className="float-layer-content">
          <div className="float-layer-inner">
            <p className="bill-info">
              菜单信息
              <i className="bill-close" onTouchTap={(e) => this.closeHover(false, e)}></i>
            </p>
            <div className="order-list-outer options-group">
              {
                bookQueueItemList && bookQueueItemList.length > 0 &&
                bookQueueItemList.map((item, index) =>
                  <BookInfoMainItem mainDish={item} setPrice={this.getEveryPrice} setNumber={this.getEveryNum} key={index} />
                )
              }
            </div>
            <div className="totalPrice">
              <span className="part">共{totalNum}份</span>
              总计：<span className="num price">{parseFloat(totalPrice.toFixed(2))}</span>
            </div>
          </div>
          <div className="options-group options-group-spe">
            <div className="option">
              <span className="option-title">备注</span>
              <div className="option-content">{bookQueueMemo || '无备注'}</div>
            </div>
          </div>
          <div className="copyright"></div>
        </div>
      </div>
    );
  },
});
