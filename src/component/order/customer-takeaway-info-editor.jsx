const React = require('react');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const CustomerInfoEditor = require('./customer-info-editor.jsx');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('./customer-address-option.jsx');
const config = require('../../config.js');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('./customer-takeaway-info-editor.scss');

module.exports = React.createClass({
  displayName: 'TakeawayCustomerInfoEditor',
  propTypes: {
    onComponentWillMount: React.PropTypes.func.isRequired,
    sendAreaId:React.PropTypes.number.isRequired,
    ...CustomerInfoEditor.propTypes,
  },
  getInitialState() {
    // set local state for address select
    const { sendAreaId } = this.props;
    return sendAreaId !== 0 ?
      this.getAddressesState(this.props.customerProps.addresses)
      :
      { addresses:null };
  },
  componentWillMount() {
    const { customerProps, onComponentWillMount, sendAreaId } = this.props;
    // If no default address, push address list from server.
    if (sendAreaId !== 0 && customerProps.addresses === null) {
      onComponentWillMount();
    }
  },
  componentWillReceiveProps(newProps) {
    const { sendAreaId } = this.props;
    if (sendAreaId !== 0) {
      const newState = this.getAddressesState(newProps.customerProps.addresses);
      this.setState(newState);
    }
  },
  onCustomerPropsChange(evt, customerProps) {
    const selectedAddress = _find(this.state.addresses, { isChecked:true });
    const customerPropsWithoutId = customerProps.without('id');
    this.props.onCustomerPropsChange(evt,
      {
        id: 'customer-info-with-address',
        ...customerPropsWithoutId,
        address:selectedAddress,
      }
    );
  },
  onAddressSelect(evt, option) {
    this.setState({
      addresses: this.state.addresses.flatMap(
        address => address.id === option.id ? address.set('isChecked', true) : address.set('isChecked', false)
      ),
    });
  },
  getAddressesState(addresses) {
    const selectedAddressIdx = _findIndex(addresses, { isChecked:true });
    if (addresses && selectedAddressIdx === -1) {
      addresses = addresses.update(0, address => address.set('isChecked', true));
    }
    return {
      addresses,
    };
  },
  render() {
    const { customerProps, onDone, sendAreaId } = this.props;
    const { addresses } = this.state;

    return (
      <div className="order-subpage">
        <CustomerInfoEditor
          onCustomerPropsChange={this.onCustomerPropsChange}
          customerProps={customerProps.without('addresses')} onDone={onDone}
        />
        <p className="address-title">请选择收货地址或到店取餐</p>
        {addresses !== null && sendAreaId !== 0 ?
          <ActiveSelect
            className="address-group"
            optionsData={addresses}
            optionComponent={CustomerAddressOption}
            onSelectOption={this.onAddressSelect}
          />
          :
          <div>到店取餐</div>
        }
        {sendAreaId !== 0 ?
          <a
            className="address-add-more"
            href={`${config.editUserAddressURL}?shopId=${getUrlParam('shopId')}`}
          >增加地址</a>
          :
          false
        }

      </div>
    );
  },
});
