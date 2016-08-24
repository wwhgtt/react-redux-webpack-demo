const React = require('react');
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('./customer-address-option.jsx');
require('./customer-takeaway-info-editor.scss');

module.exports = React.createClass({
  displayName: 'TakeawayCustomerInfoEditor',
  propTypes: {
    customerAddressListInfo:React.PropTypes.object,
    customerProps:React.PropTypes.object,
    defaultCustomerProps:React.PropTypes.object,
    onComponentWillMount: React.PropTypes.func.isRequired,
    onAddressEditor:React.PropTypes.func.isRequired,
    onCustomerAddressPropsChange:React.PropTypes.func.isRequired,
    onDone:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      addressListInfo: { inList: [], outList: [], toShopInfo:{ toShopFlag:true } },
      addressCount: 0,
    };
  },
  componentDidMount() {
    const { onComponentWillMount, customerAddressListInfo } = this.props;
    if (!customerAddressListInfo || !customerAddressListInfo.isAddressesLoaded) {
      onComponentWillMount();
    } else {
      this.initStateByProps(this.props);
    }
  },
  componentWillReceiveProps(newProps) {
    this.initStateByProps(newProps);
  },
  onAddressSelect(evt, option, func) {
    const addressEditor = evt.target.getAttribute('data-editor');
    func(addressEditor);
  },
  onAddressSelectInList(evt, option) {
    this.onAddressSelect(evt, option, (editor) => {
      if (editor) {
        this.props.onAddressEditor(editor, option);
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
  initStateByProps(props) {
    const { customerAddressListInfo, customerProps } = props;
    if (!customerAddressListInfo || !customerProps) {
      return;
    }

    let data = customerAddressListInfo.data;
    const addressCount = data.inList.length + data.outList.length;
    const { toShopInfo } = data;
    if (toShopInfo.toShopFlag) {
      data = data.update('inList', list => list.concat([], {
        name: toShopInfo.name || '',
        sex: parseInt(toShopInfo.sex, 10) || 0,
        address: '到店取餐',
        id: 0,
        rangeId: 0,
        mobile: toShopInfo.mobile,
      }));
    }

    const selectedAddress = customerProps.addresses && customerProps.addresses.find(item => item.isChecked);
    if (selectedAddress) {
      data = data.update('inList', list => list.map(item => item.set('isChecked', selectedAddress.id === item.id)));
    } else if (data.inList.length) {
      data = data.updateIn(['inList', '0'], item => item.set('isChecked', true));
    }
    this.setState({
      addressListInfo: data,
      addressCount,
    });
  },
  buildAddressElement() {
    const { onAddressEditor } = this.props;
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
        sex: ['女士', '先生'][sex] || '',
      };
    });

    // 在配送范围
    if (inList.length) {
      if (outList.length) {
        elems.push(<p key="in" className="address-group-divider">可选收货地址</p>);
      }
      elems.push(
        <ActiveSelect
          key="inSelect"
          className="address-group"
          optionsData={addressListToOptionsData(inList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelectInList}
        />
      );
    }
    // 不在配送范围
    if (outList.length) {
      elems.push(<p key="out" className="address-group-divider">不在配送范围内</p>);
      elems.push(
        <ActiveSelect
          key="outSelect"
          className="address-group address-group-disabled"
          optionsData={addressListToOptionsData(outList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelectOutList}
        />
      );
    }
    if (this.state.addressCount < 10) {
      elems.push(<a key="add" className="address-add-more" onTouchTap={onAddressEditor}>新增地址</a>);
    }
    return elems;
  },
  completeSelect(evt, selectedAddress) {
    const { onCustomerAddressPropsChange, onDone } = this.props;
    const info = { id: 'customer-info-selected-address' };
    info.addresses = [
      Object.assign({}, selectedAddress, { isChecked: true }),
    ];
    if (onCustomerAddressPropsChange(evt, info)) onDone(evt, '');
  },
  render() {
    return (
      <div className="address subpage">
        {this.buildAddressElement()}
        <div className="address-comments">
          最多为您保存10个常用地址<br />还需要新增，请删除或修改以上地址
        </div>
      </div>
    );
  },
});
