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
    let addressCount = 0;
    if (data.inList) {
      addressCount += data.inList.length;
    }
    if (data.outList) {
      addressCount += data.outList.length;
    }
    if (data.toShopInfo.toShopFlag) {
      const defaultCustomerProps = props.defaultCustomerProps || {};
      data = data.update('inList', list => list.concat([], {
        name: defaultCustomerProps.name || '',
        sex: parseInt(defaultCustomerProps.sex, 10) || 0,
        address: '到店取餐',
        id: 0,
        rangeId: 0,
        mobile: defaultCustomerProps.mobile,
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
        sex: sex === 1 ? '先生' : '女士 ',
      };
    });

    let listCount = 0;
    // 在配送范围
    if (inList && inList.length) {
      listCount += inList.length;
      elems.push(<p key="in" className="address-title">可选收货地址</p>);
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
    if (outList && outList.length) {
      listCount += outList.length;
      elems.push(<p key="out" className="address-title">不在配送范围内</p>);
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
    const { name, sex, mobile, address } = selectedAddress;
    const info = { name, sex, mobile, id: 'customer-info' };
    info.addresses = [{ address, id: selectedAddress.id, isChecked: true, rangeId: selectedAddress.rangeId }];
    if (onCustomerAddressPropsChange(evt, info)) onDone(evt, '');
  },
  render() {
    return (
      <div className="order-subpage">
        <div className="order-subpage-content">
          {this.buildAddressElement()}
          <div className="address-title address-count-descript">
            最多为您保存10个常用地址<br />还需要新增，请删除或修改以上地址
          </div>
        </div>
      </div>
    );
  },
});
