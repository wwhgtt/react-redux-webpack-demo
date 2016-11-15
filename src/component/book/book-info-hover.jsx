const React = require('react');
require('./book-info-hover.scss');
const BookInfoMainItem = require('./book-info-main-item.jsx');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'BookInfoHover',
  propTypes:{
    bookInfoItemList:React.PropTypes.array,
    bookDetail:React.PropTypes.object,
    setHoverState:React.PropTypes.func,
    getBookInfo:React.PropTypes.func,
  },
  getInitialState() {
    return { totalPrice:0, totalNum:0 };
  },
  componentWillMount() {
    this.arrayPrice = [];
    this.arrayNum = [];

    // 获取 bookInfoItemList
    const { getBookInfo } = this.props;
    getBookInfo();
  },
  componentDidMount() {},
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  getEveryPrice(price) {
    this.arrayPrice.push(+price);
    if (this.arrayPrice.length === this.props.bookInfoItemList.length) {
      setTimeout(() => {
        this.setState({ totalPrice:this.arrayPrice.reduce((a, b) => a + b) });
      }, 500);
    }
  },
  getEveryNum(num) {
    this.arrayNum.push(+num);
    if (this.arrayNum.length === this.props.bookInfoItemList.length) {
      setTimeout(() => {
        this.setState({ totalNum:this.arrayNum.reduce((a, b) => a + b) });
      }, 500);
    }
  },
  closeHover(bool, e) {
    e.preventDefault();
    const { setHoverState } = this.props;
    setHoverState(bool);
  },
  render() {
    const { bookInfoItemList, bookDetail } = this.props;
    const { totalPrice, totalNum } = this.state;
    return (
      <div className="float-layer">
        <div className="float-layer-hover"></div>
        <div className="float-layer-content">
          <div className="float-layer-inner">
            <p className="bill-info">
              菜单信息
              <i className="bill-close" onTouchTap={(e) => this.closeHover(false, e)}></i>
            </p>
            <div className="order-list-outer options-group">
              {
                bookInfoItemList && bookInfoItemList.length > 0 &&
                bookInfoItemList.map((item, index) =>
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
              <div className="option-content">{bookDetail.memo}</div>
            </div>
          </div>
          <div className="copyright"></div>
        </div>
      </div>
    );
  },
});
