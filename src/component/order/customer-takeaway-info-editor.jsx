const React = require('react');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const CustomerInfoEditor = require('./customer-info-editor.jsx');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('./customer-address-option.jsx');

module.exports = React.createClass({
  displayName: 'TakeawayCustomerInfoEditor',
  propTypes: {
    onComponentWillMount: React.PropTypes.func.isRequired,
    ...CustomerInfoEditor.propTypes,
  },
  getInitialState() {
    // set local state for address select
    return this.getAddressesState(this.props.customerProps.addresses);
  },
  componentWillMount() {
    const { customerProps, onComponentWillMount } = this.props;
    // If no default address, push address list from server.
    if (customerProps.addresses === null) {
      onComponentWillMount();
    }
  },
  componentWillReceiveProps(newProps) {
    const newState = this.getAddressesState(newProps.customerProps.addresses);
    this.setState(newState);
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
    const { customerProps } = this.props;
    const { addresses } = this.state;

    return (
      <div className="customer-address-info-editor">
        <CustomerInfoEditor
          onCustomerPropsChange={this.onCustomerPropsChange}
          customerProps={customerProps.without('addresses')}
        />
        {addresses !== null ?
          <ActiveSelect
            optionsData={addresses}
            optionComponent={CustomerAddressOption}
            onSelectOption={this.onAddressSelect}
          />
          :
          false
        }
      </div>
    );
  },
});
