const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/order/order');
require('../../asset/style/style.scss');
require('./application.scss');
import ActiveSelect from '../../component/mui/select/active-select.jsx';
const OrderPropOption = require('../../component/order/order-prop-option.jsx');

const OrderApplication = React.createClass({
  displayName: 'OrderApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrder:React.PropTypes.func.isRequired,
    setOrderProps:React.PropTypes.func.isRequired,
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
    serviceProps:React.PropTypes.object.isRequired,
    commercialProps:React.PropTypes.object.isRequired,
  },
  componentDidMount() {
    this.props.fetchOrder();
  },
  componentDidUpdate() {
  },
  render() {
    const { customerProps, serviceProps } = this.props; // states
    const { setOrderProps } = this.props;// actions
    return (
      <div className="application">
        <div className="customer-info">
          <h2 className="customer-name">
            <span>{customerProps.name}</span>
            <span>{customerProps.sex === '1' ? '先生' : '女士'}</span>
          </h2>
          <h2 className="customer-extra-info">
            <span>{customerProps.mobile}</span>
            <span>{customerProps.customerCount}人就餐</span>
          </h2>
        </div>
        <div className="eat-in-or-take-away">
          {serviceProps.isPickupFromFrontDesk ?
            <ActiveSelect
              optionsData={[serviceProps.isPickupFromFrontDesk]} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption} triggerElement
            />
            : false
          }
        </div>
        <div className="order-pay-method">
          {serviceProps.payMethods ?
            <ActiveSelect
              optionsData={serviceProps.payMethods} onSelectOption={setOrderProps}
              optionComponent={OrderPropOption} triggerElement
            />
          : false}
        </div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
