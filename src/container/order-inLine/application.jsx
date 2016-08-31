const React = require('react');
const connect = require('react-redux').connect;
const config = require('../../config.js');
const actions = require('../../action/order-inLine/order-inLine.js');
const CustomerInfoEditor = require('../../component/order/customer-info-editor.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('../../asset/style/style.scss');
require('./application.scss');

const OrderInlineApplication = React.createClass({
  displayName: 'OrderInlineApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrderInLineProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    commercialProps:React.PropTypes.object.isRequired,
    customerProps:React.PropTypes.object.isRequired,
    queueList:React.PropTypes.any.isRequired,
  },
  componentDidMount() {
    const { fetchOrderInLineProps } = this.props;
    fetchOrderInLineProps();
  },
  render() {
    const { commercialProps } = this.props; // state
    // const {} = this.props;// actions
    return (
      <div className="application">
        <a className="option order-shop" href={config.shopDetailURL + '?shopId=' + getUrlParam('shopId')}>
          <img className="order-shop-icon" src={commercialProps.shopLogo} alt="" />
          <p className="order-shop-desc ellipsis">{commercialProps.shopName}</p>
        </a>
        <p>
          <span>就餐人数</span>
          <ImportableCounter />
        </p>
        <CustomerInfoEditor />
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderInlineApplication);
