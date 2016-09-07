const React = require('react');
const connect = require('react-redux').connect;
const config = require('../../config.js');
const actions = require('../../action/order-in-line/order-in-line.js');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const Toast = require('../../component/mui/toast.jsx');
const VerificationDialog = require('../../component/common/verification-code-dialog.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const weilianwangImg = require('../../asset/images/weilianwang.png');
const yidayangImg = require('../../asset/images/yidayang.png');
require('../../asset/style/style.scss');
require('./application.scss');
require('../../component/order/order-summary.scss'); // import option-shop styles

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
    setPhoneValidateProps:React.PropTypes.func.isRequired,
    fetchVericationCode:React.PropTypes.func.isRequired,
    checkCodeAvaliable:React.PropTypes.func.isRequired,
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
      queueList.map(quene => element.push(<li className="queue-entry" key={quene.queueLineId}>
        <span className="ellipsis">{quene.queueName}</span>
        <span>{quene.minPersonCount}-{quene.maxPersonCount}人</span>
        <span>{quene.count}桌</span>
      </li>)
      );
    }
    return element;
  },
  // 校验验证码
  handleConfirm(inputInfo) {
    const { setErrorMsg, checkCodeAvaliable } = this.props;
    const { data, validation } = inputInfo;
    if (!validation.valid) {
      setErrorMsg(validation.msg);
      return false;
    }
    // 新加内容，校验验证码是否正确
    checkCodeAvaliable(data);
    return false;
  },
  handleCodeClose() {
    const { setPhoneValidateProps } = this.props;
    setPhoneValidateProps(false);
  },
  buildPhoneValidateElement() {
    const { customerProps, fetchVericationCode } = this.props;
    const placeholder = { phoneNum:customerProps.mobile, code:'' };
    return (
      <div className="phone-validate-WM">
        <VerificationDialog
          phoneNum={placeholder.phoneNum ? placeholder.phoneNum.toString() : ''}
          phoneNumDisabled={!!placeholder.phoneNum}
          fetchCodeBtnText={'验证码'}
          onClose={this.handleCodeClose}
          onConfirm={this.handleConfirm}
          onGetVerificationCode={fetchVericationCode}
        />
      </div>
    );
  },
  render() {
    const { commercialProps, errorMessage, queueList, customerProps, dinePersonCount, shuoldPhoneValidateShow } = this.props; // state
    const { clearErrorMsg, submitOrder, setErrorMsg, setCustomerProps } = this.props;// actions
    return (
      <div className="application">
        <div className="options-group">
          <a className="option option-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
            <img className="option-shop-icon" src={commercialProps.shopLogo} alt="" />
            <p className="option-shop-desc ellipsis">{commercialProps.shopName}</p>
          </a>
        </div>

        {commercialProps.openStatus === '营业中' ?
          <div className="queue-form">
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
              <div className="option">
                <button onTouchTap={submitOrder} className="queue-btn btn--yellow">立即取号</button>
              </div>
            </div>

            {queueList && queueList.length ?
              <div className="options-group">
                <ul className="queue-list">
                  <li className="queue-title">
                    <span>队列名称</span>
                    <span>就餐人数</span>
                    <span>等待桌数</span>
                  </li>
                  {this.buildLinePropsElement()}
                </ul>
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
          <div className="error-situation">
            {commercialProps.openStatus === '已打烊' ?
              <img src={yidayangImg} alt="已打烊" />
              :
              <div>
                {commercialProps.openStatus === '商家设备未联网' ?
                  <img src={weilianwangImg} alt="商家设备未联网" />
                  :
                  false
                }
              </div>
            }
          </div>
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderInlineApplication);
