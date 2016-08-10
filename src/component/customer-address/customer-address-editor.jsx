const React = require('react');
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
    const { customerProps, onRemoveAddress } = this.props;
    if (onRemoveAddress) {
      onRemoveAddress(customerProps);
    }
  },
  onSaveBtntap(evt) {
    const validateRet = this.validateInput();
    const { customerProps, onSaveAddress } = this.props;
    if (onSaveAddress) {
      onSaveAddress(validateRet, customerProps);
    }
  },
  validateInput() {
    const rules = {
      name: [
        { msg: '请输入姓名', validate(value) { return !!value.trim(); } },
      ],
      mobile: [
        { msg: '请输入手机号', validate(value) { return !!value.trim(); } },
        { msg: '请录入正确的手机号', validate(value) { return /^1[34578]\d{9}$/.test(value); } },
      ],
      baseAddress: [
        { msg: '请输入收货地址', validate(value) { return !!value.trim(); } },
      ],
      street: [
        { msg: '请输入门牌号', validate(value) { return !!value.trim(); } },
      ],
    };

    const { customerProps } = this.props;
    for (const key of Object.getOwnPropertyNames(rules)) {
      const rule = rules[key];
      const value = customerProps[key];
      for (const item of rule) {
        const valid = item.validate(value || '');
        if (!valid) {
          return { valid: false, msg: item.msg };
        }
      }
    }
    return { valid: true, msg: '' };
  },
  handleBasicInfoChange(evt) {
    const input = evt.target;
    const propertys = {};
    propertys[input.name] = input.value.trim();
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(propertys);
    }
  },
  render() {
    const { customerProps } = this.props;
    return (
      <div className="order-subpage">
        <div className="order-subpage-content">
          <div className="options-group">
            <div className="order-prop-option">
              <span className="option-title">姓名：</span>
              <div className="editor-input">
                <input
                  type="text"
                  className="editor-input"
                  name="name"
                  id="editor-name"
                  placeholder="请录入姓名"
                  maxLength="30"
                  value={customerProps.name || ''}
                  onChange={this.handleBasicInfoChange}
                />
              </div>
              <div className="" style={{ float: 'left' }}>
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="1"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === '1'}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">先生</span>
                </label>
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="0"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex < 1}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">女士</span>
                </label>
              </div>
            </div>

            <label className="order-prop-option">
              <span className="option-title">联系电话：</span>
              <input
                type="number"
                className="editor-input"
                name="mobile"
                onChange={this.handleBasicInfoChange}
                maxLength="11"
                value={customerProps.mobile || ''}
              />
            </label>
            <label className="order-prop-option">
              <span className="option-title">收货地址：</span>
              <input
                type="text"
                className="editor-input"
                name="baseAddress"
                onChange={this.handleBasicInfoChange}
                maxLength="35"
                value={customerProps.baseAddress || ''}
              />
              <a className="option-btn btn-arrow-right" href="#address-select"></a>
            </label>
            <label className="order-prop-option">
              <span className="option-title">门牌信息：</span>
              <input
                type="text"
                className="editor-input"
                name="street"
                onChange={this.handleBasicInfoChange}
                maxLength="35"
                value={customerProps.street || ''}
              />
            </label>
          </div>

          {customerProps.id ?
            <div className="options-group">
              <a className="order-prop-option address-delete-text" onTouchTap={this.onRemoveLinktap}>删除地址</a>
            </div>
            :
            false
          }
        </div>
        <button className="order-subpage-submit btn--yellow" onTouchTap={this.onSaveBtntap}>保存</button>
      </div>
    );
  },
});
