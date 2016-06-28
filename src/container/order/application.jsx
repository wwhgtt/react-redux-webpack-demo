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
    // MapedStatesToProps
    customerProps:React.PropTypes.object.isRequired,
  },
  componentDidMount() {
    this.props.fetchOrder();
  },
  componentDidUpdate() {
  },
  onSelectOption() {
    console.log(123);
  },
  render() {
    const { customerProps } = this.props; // states
    const optionsData = customerProps.serviceApproach === 'pickup' ?
    [{ name:'前台取餐', isChecked:true, key:'pickup', id:1 }] : [{ name:'前台取餐', isChecked:false, key:'totable', id:0 }];
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
        {/* chose table*/}
        <ActiveSelect
          optionsData={optionsData} onSelectOption={this.onSelectOption}
          optionComponent={OrderPropOption}
        />
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderApplication);
