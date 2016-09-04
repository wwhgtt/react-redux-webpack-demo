const React = require('react');
const connect = require('react-redux').connect;
const config = require('../../config.js');
const actions = require('../../action/order-inLine/order-inLine.js');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const Toast = require('../../component/mui/toast.jsx');
const PhoneVerificationCode = require('../../component/mui/form/phone-verification-code.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('../../asset/style/style.scss');
require('./application.scss');

const OrderInlineApplication = React.createClass({
  displayName: 'OrderInlineApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrderInLineProps:React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func.isRequired,
    submitOrder:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    setCustomerProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    queueList:React.PropTypes.array.isRequired,
    errorMessage:React.PropTypes.string,
    dinePersonCount:React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]).isRequired,
    shuoldPhoneValidateShow:React.PropTypes.bool.isRequired,
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
  buildPhoneValidateElement() {
    const { customerProps, submitOrder } = this.props;
    const placeholder = { phoneNum:customerProps.mobile, code:'' };
    return (
      <div className="phone-validate-WM">
        <PhoneVerificationCode placeholder={placeholder} disabled="disabled" />
        <button className="submit-validate-code" onTouchTap={evt => submitOrder()}>确定</button>
      </div>
    );
  },
  render() {
    const { commercialProps, errorMessage, queueList, customerProps, dinePersonCount, shuoldPhoneValidateShow } = this.props; // state
    const { clearErrorMsg, submitOrder, setErrorMsg, setCustomerProps } = this.props;// actions
    return (
      <div className="application">
        <a className="option order-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
          <img className="order-shop-icon" src={commercialProps.shopLogo} alt="" />
          <p className="order-shop-desc ellipsis">{commercialProps.shopName}</p>
        </a>

        {commercialProps.openStatus === '营业中' ?
          <div>
            <CustomerInfoEditor customerProps={customerProps} onCustomerPropsChange={setCustomerProps} isMobileDisabled={false} />

            <div className="options-group">
              <div className="option">
                <span className="option-tile">就餐人数：</span>
                <ImportableCounter
                  setErrorMsg={setErrorMsg}
                  onCountChange={this.onCountChange}
                  count={dinePersonCount}
                  maximum={99}
                  minimum={1}
                />
              </div>
            </div>

            <button onTouchTap={submitOrder} className="submit-order">立即取号</button>

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

            {shuoldPhoneValidateShow ?
              this.buildPhoneValidateElement()
              :
              false
            }
          </div>
          :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderInlineApplication);
