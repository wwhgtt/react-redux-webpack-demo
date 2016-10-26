const React = require('react');
const validateAddressInfo = require('../../helper/order-helper').validateAddressInfo;
const replaceEmojiWith = require('../../helper/common-helper').replaceEmojiWith;
const classnames = require('classnames');
require('./customer-address-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerAddressEditor',
  propTypes: {
    customerProps: React.PropTypes.object,
    onPropertyChange: React.PropTypes.func,
    onSaveAddress: React.PropTypes.func,
    onRemoveAddress: React.PropTypes.func,
  },
  componentDidMount() {
  },
  onRemoveLinktap(evt) {
    evt.preventDefault();
    const { onRemoveAddress } = this.props;
    if (!window.confirm('您确定删除该地址吗？')) {
      return;
    }

    if (onRemoveAddress) {
      onRemoveAddress();
    }
  },
  onSaveBtntap(evt) {
    const validateRet = this.validateInput();
    const { customerProps, onSaveAddress } = this.props;
    const addressInfo = Object.assign({}, customerProps);
    if (validateRet.valid) {
      addressInfo.name = replaceEmojiWith(addressInfo.name.trim());
      addressInfo.street = replaceEmojiWith(addressInfo.street.trim());
      addressInfo.address = addressInfo.baseAddress + addressInfo.street;
    }
    if (onSaveAddress) {
      onSaveAddress(evt, validateRet, addressInfo);
    }
  },
  validateInput() {
    const info = this.props.customerProps;
    return validateAddressInfo(info, true);
  },
  handleBasicInfoChange(evt) {
    const input = evt.target;
    const { customerProps } = this.props;
    const propertys = {};
    let value = propertys[input.name] = input.value;
    if (input.name === 'sex') {
      propertys[input.name] = value = parseInt(value, 10) || 0;
    }
    if (value === customerProps[input.name]) {
      return;
    }

    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(propertys);
    }
  },
  render() {
    const { customerProps } = this.props;
    if (customerProps.sex === undefined) {
      return false;
    }

    let baseAddress = customerProps.baseAddress || '';
    const bracketIndex = baseAddress.indexOf('(');
    if (~bracketIndex) {
      baseAddress = baseAddress.substr(0, bracketIndex);
    }
    return (
      <div className="customer-address-page">
        <div className="options-group">
          <div className="option">
            <span className="option-title">姓名：</span>
            <div className="option-content">
              <input
                type="text"
                className="option-input customer-name"
                name="name"
                id="editor-name"
                placeholder="请输入姓名"
                maxLength="30"
                value={customerProps.name || ''}
                onChange={this.handleBasicInfoChange}
              />
              <div className="customer-gender">
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="1"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === 1}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">先生</span>
                </label>
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="0"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === 0}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">女士</span>
                </label>
              </div>
            </div>
          </div>

          <label className="option">
            <span className="option-title">联系电话：</span>
            <input
              type="tel"
              className="option-content option-input"
              name="mobile"
              onChange={this.handleBasicInfoChange}
              maxLength="11"
              placeholder="请输入手机号码"
              value={customerProps.mobile || ''}
            />
          </label>
          <label className={classnames('option', { error: customerProps.id && !customerProps.baseAddress })}>
            <span className="option-title">收货地址：</span>
            <a className="option-content btn-arrow-right customer-address" href="#address-select">
              <span className="customer-address-text ellipsis">{baseAddress}</span>
              <span className="customer-address-placeholder">请选择收货地址</span>
            </a>
          </label>
          <label className="option">
            <span className="option-title">门牌信息：</span>
            <input
              type="text"
              className="option-content option-input"
              name="street"
              onChange={this.handleBasicInfoChange}
              maxLength="30"
              placeholder="请输入门牌信息"
              value={customerProps.street || ''}
            />
          </label>
        </div>

        {customerProps.id ?
          <div className="options-group">
            <button className="option customer-address-delete" onTouchTap={this.onRemoveLinktap}>删除地址</button>
          </div>
          :
          false
        }

        <button className="btn-submit btn--yellow" onTouchTap={this.onSaveBtntap}>保存</button>
      </div>
    );
  },
});
