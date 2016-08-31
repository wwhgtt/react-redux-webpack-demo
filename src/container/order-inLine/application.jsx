const React = require('react');
const connect = require('react-redux').connect;
const config = require('../../config.js');
const actions = require('../../action/order-inLine/order-inLine.js');
// const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
// const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const Toast = require('../../component/mui/toast.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

const OrderInlineApplication = React.createClass({
  displayName: 'OrderInlineApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrderInLineProps:React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    placeOrder:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    queueList:React.PropTypes.array.isRequired,
    errorMessage:React.PropTypes.string,
  },
  componentDidMount() {
    const { fetchOrderInLineProps } = this.props;
    fetchOrderInLineProps();
  },
  onCountChange(newCount, increment) {
    const { setOrderProps } = this.props;
    const dinePersonCount = { id:'dine-person-count', newCount };
    setOrderProps(null, dinePersonCount);
  },
  buildLinePropsElement() {
    const { queueList } = this.props;
    let element = [];
    if (queueList && queueList.length) {
      queueList.map(quene => element.push(<p className="order-inLine" key={quene.queueLineId}>
        <span>{quene.queueName}</span>
        <span>{quene.minPersonCount}-{quene.maxPersonCount}人</span>
        <span>{quene.count}桌</span>
      </p>)
      );
    }
    return element;
  },
  render() {
    const { commercialProps, errorMessage, queueList, customerProps } = this.props; // state
    const { clearErrorMsg, placeOrder, setErrorMsg } = this.props;// actions
    return (
      <div className="application">
        <a className="option order-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
          <img className="order-shop-icon" src={commercialProps.shopLogo} alt="" />
          <p className="order-shop-desc ellipsis">{commercialProps.shopName}</p>
        </a>
        <p>
          <span>就餐人数</span>
          <ImportableCounter count={customerProps.dinePersonCount} onCountChange={this.onCountChange} setErrorMsg={setErrorMsg} />
        </p>
        <button onToutap={placeOrder} className="submit-order">立即取号</button>

        {queueList && queueList.length ?
          <div>
            <p className="order-inLine">
              <span>队列名称</span>
              <span>就餐人数</span>
              <span>等待桌数</span>
            </p>
            {this.buildLinePropsElement()}
          </div>
          :
          false
        }


        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderInlineApplication);
