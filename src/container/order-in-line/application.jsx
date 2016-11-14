const React = require('react');
const classnames = require('classnames');
const connect = require('react-redux').connect;
const actions = require('../../action/order-in-line/order-in-line.js');
const ListCustomerInfoEditor = require('../../component/order/list-customer-info-editor.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const Toast = require('../../component/mui/toast.jsx');
const VerificationDialog = require('../../component/common/verification-code-dialog.jsx');
const weilianwangImg = require('../../asset/images/weilianwang.svg');
const yidayangImg = require('../../asset/images/yidayang.png');
const defaultShopLogo = require('../../asset/images/default.png');
require('../../asset/style/style.scss');
require('../place-order/application.scss');
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
      for (let i = 0; i < queueList.length; i++) {
        element.push(<li className="queue-entry" key={queueList[i].queueLineId}>
          <span className="ellipsis">{queueList[i].queueName}</span>
          <span>
            {queueList[i].minPersonCount === queueList[i].maxPersonCount ?
              queueList[i].minPersonCount + '人'
              :
              `${queueList[i].minPersonCount}${queueList[i].maxPersonCount === 0 ? '人以上' : `～${queueList[i].maxPersonCount}人`}`
            }
          </span>
          <span>{queueList[i].count}桌</span>
        </li>);
      }
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
        <div className="content">
          <div className="content-shop">
            <img className="content-shop-icon" src={commercialProps.shopLogo || defaultShopLogo} alt="" />
            <p className="content-shop-desc ellipsis">{commercialProps.shopName}</p>
          </div>
          <div className="divider">
            <span className={classnames('divider-title', { 'divider-hide':commercialProps.openStatus !== '营业中' })}>排队信息</span>
          </div>
          {commercialProps.openStatus === '营业中' ?
            <div className="options-group" style={{ borderBottom:'none' }}>
              <div className="option">
                <span className="option-tile">就餐人数</span>
                <ImportableCounter
                  setErrorMsg={setErrorMsg}
                  onCountChange={this.onCountChange}
                  maximum={commercialProps.maxPersonNum}
                  minimum={1}
                  count={
                    commercialProps.maxPersonNum && +dinePersonCount < +commercialProps.maxPersonNum ?
                    dinePersonCount : commercialProps.maxPersonNum
                  }
                />
              </div>
            </div>
            :
            false
          }
            {commercialProps.openStatus === '营业中' ?
              <div className="queue-form">
                <ListCustomerInfoEditor
                  customerProps={customerProps}
                  onCustomerPropsChange={setCustomerProps}
                  isMobileDisabled={customerProps.mobile === null}
                />

                <div className="option" style={{ width:'94%', marginLeft:'3%' }}>
                  <button onTouchTap={submitOrder} className="queue-btn btn--yellow">立即取号</button>
                </div>

                {shuoldPhoneValidateShow ?
                  this.buildPhoneValidateElement()
                  :
                  false
                }
              </div>
              :
              <div className="error-situation">
                {commercialProps.openStatus === '已打烊' ?
                  <div>
                    <img src={yidayangImg} className="center-image" alt="已打烊" />
                    <p className="errorMessage">诶呀，没有开门</p>
                  </div>
                  :
                  <div>
                    {commercialProps.openStatus === '商家设备未联网' ?
                      <div>
                        <img src={weilianwangImg} className="center-image" alt="商家设备未联网" />
                        <p className="errorMessage">设备未接入网络</p>
                      </div>
                      :
                      false
                    }
                  </div>
                }
              </div>
            }
          {commercialProps.openStatus === '营业中' && queueList && queueList.length ?
            <div>
              <div className="options-group" style={{ height:'15px', backgroundColor:'#ff944d' }}></div>
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
            </div>
            :
            false
          }
        </div>
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
