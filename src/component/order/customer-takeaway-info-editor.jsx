const React = require('react');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('./customer-address-option.jsx');
require('./customer-takeaway-info-editor.scss');

module.exports = React.createClass({
  displayName: 'TakeawayCustomerInfoEditor',
  propTypes: {
    customerAddressListInfo:React.PropTypes.object,
    customerProps:React.PropTypes.object,
    onComponentWillMount: React.PropTypes.func.isRequired,
    onAddressEditor:React.PropTypes.func.isRequired,
    onCustomerPropsChange:React.PropTypes.func.isRequired,
    onDone:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      id: '',
      addressListInfo: { inList: [], outList: [], toShopInfo:{ toShopFlag:true } },
    };
  },
  componentWillMount() {
    const { onComponentWillMount, customerAddressListInfo } = this.props;
    if (!customerAddressListInfo || !customerAddressListInfo.isAddressesLoaded) {
      onComponentWillMount();
    }
  },
  componentWillReceiveProps(newProps) {
    const { customerAddressListInfo, customerProps } = newProps;
    if (customerAddressListInfo !== undefined) {
      const newState = this.getAddressesState(customerAddressListInfo.data, customerProps);
      this.setState(newState);
    }
  },
  onAddressSelect(evt, option, func) {
    const addressEditor = evt.target.getAttribute('data-editor');
    func(addressEditor);
  },
  onAddressSelectInList(evt, option) {
    this.onAddressSelect(evt, option, (editor) => {
      if (editor) {
        this.props.onAddressEditor(editor);
        return;
      }

      const { addressListInfo } = this.state;
      this.setState({
        addressListInfo: addressListInfo.update('inList', inList => inList.map(item =>
          item.set('isChecked', option.id === item.id)
        )),
      });

      const selectedAddress = addressListInfo.inList.find(item => item.id === option.id);
      if (selectedAddress) {
        this.completeSelect(evt, selectedAddress);
      }
    });
  },
  onAddressSelectOutList(evt, option) {
    this.onAddressSelect(evt, option, (editor) => {
      if (editor) {
        this.props.onAddressEditor(editor);
      }
    });
  },
  getAddressesState(addressListInfo, customerProps) {
    let info = addressListInfo;
    if (addressListInfo.toShopInfo.toShopFlag) {
      info = addressListInfo.update('inList', list => list.concat({ name: 'xxx', address: '到店取餐', id: 1 }));
    }
    info = info.updateIn(['inList', '0'], item => item.set('isChecked', true));
    return {
      addressListInfo: info,
      id: customerProps.id,
    };
  },
  buildAddressElement() {
    const { inList, outList } = this.state.addressListInfo;
    const elems = [];
    const addressListToOptionsData = addressList => addressList.map(item => {
      const { address, name, sex, mobile } = item;
      return {
        id: item.id,
        address,
        label: address,
        name,
        mobile,
        isChecked: item.isChecked,
        sex: sex === 1 ? '先生' : '女士 ',
      };
    });
    // 在配送范围
    if (inList && inList.length) {
      elems.push(<p className="address-title">可选收货地址</p>);
      elems.push(
        <ActiveSelect
          className="address-group"
          optionsData={addressListToOptionsData(inList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelectInList}
        />
      );
    }
    // 不在配送范围
    if (outList && outList.length) {
      elems.push(<p className="address-title">不在配送范围内</p>);
      elems.push(
        <ActiveSelect
          className="address-group"
          optionsData={addressListToOptionsData(outList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelectOutList}
        />
      );
    }
    return elems;
  },
  completeSelect(evt, customerAddressInfo) {
    const { onCustomerPropsChange, onDone } = this.props;
    const { name, sex, mobile, address } = customerAddressInfo;
    const info = { name, sex, mobile, address, id: 'customer-info' };
    if (onCustomerPropsChange(evt, info)) onDone(evt, '');
  },
  render() {
    const { onAddressEditor } = this.props;
    return (
      <div className="order-subpage">
        <div className="order-subpage-content">
          {this.buildAddressElement()}
          <a className="address-add-more" onTouchTap={onAddressEditor}>增加地址</a>
        </div>
      </div>
    );
  },
});
