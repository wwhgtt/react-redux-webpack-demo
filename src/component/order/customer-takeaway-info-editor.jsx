const React = require('react');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const CustomerInfoEditor = require('./customer-info-editor.jsx');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('./customer-address-option.jsx');
require('./customer-takeaway-info-editor.scss');

module.exports = React.createClass({
  displayName: 'TakeawayCustomerInfoEditor',
  propTypes: {
    onComponentWillMount: React.PropTypes.func.isRequired,
    sendAreaId:React.PropTypes.number.isRequired,
    onAddressEditor:React.PropTypes.func.isRequired,
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
    const { onComponentWillMount, sendAreaId } = this.props;
    // If no default address, push address list from server.
    if (sendAreaId !== 0) {
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
    const { onDone } = this.props;
    const selectedAddress = _find(this.state.addresses, { isChecked:true });
    const customerPropsWithoutId = customerProps.without('id');
    if (this.props.onCustomerPropsChange(evt,
      {
        id: 'customer-info-with-address',
        ...customerPropsWithoutId,
        address:selectedAddress,
      }
    )) onDone('');
  },
  onAddressSelect(evt, option) {
    const { onAddressEditor } = this.props;
    const addressEditor = evt.target.getAttribute('data-editor');
    if (!addressEditor) {
      this.setState({
        addresses: this.state.addresses.flatMap(
          address => address.id === option.id ? address.set('isChecked', true) : address.set('isChecked', false)
        ),
      });
    } else {
      onAddressEditor(addressEditor);
    }
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
    const { customerProps, onDone, sendAreaId, onAddressEditor } = this.props;
    const { addresses } = this.state;

    return (
      <div className="order-subpage">
        <CustomerInfoEditor
          onCustomerPropsChange={this.onCustomerPropsChange}
          customerProps={customerProps.without('addresses')} onDone={onDone}
        />
        <p className="address-title">请选择收货地址或到店取餐</p>
        {addresses !== null && addresses !== [] && sendAreaId !== 0 ?
          <ActiveSelect
            className="address-group"
            optionsData={addresses}
            optionComponent={CustomerAddressOption}
            onSelectOption={this.onAddressSelect}
          />
          :
          <div className="pickup-option is-checked">到店取餐</div>
        }
        {sendAreaId !== 0 ?
          <a
            className="address-add-more"
            onTouchTap={onAddressEditor}
          >增加地址</a>
          :
          false
        }

      </div>
    );
  },
});
