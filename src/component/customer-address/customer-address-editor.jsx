const React = require('react');
require('./customer-address-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerAddressEditor',
  propTypes: {
    customerProps:React.PropTypes.object,
  },
  componentDidMount() {
  },
  componentWillReceiveProps(newProps) {
  },
  onSubmitBtntap(evt) {
  },
  handleBasicInfoChange(event) {
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
                  className="editor-input"
                  name="name"
                  id="editor-name"
                  placeholder={customerProps.name}
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
              <input className="editor-input" value={customerProps.mobile} />
            </label>
            <label className="order-prop-option">
              <span className="option-title">收货地址：</span>
              <input className="editor-input" value={customerProps.address} />
              <a className="option-btn btn-arrow-right" href="#address-select"></a>
            </label>
            <label className="order-prop-option">
              <span className="option-title">门牌信息：</span>
              <input className="editor-input" value={customerProps.doorplates} />
            </label>
          </div>

          <div className="options-group">
            <a className="order-prop-option address-delete-text">删除地址</a>
          </div>
        </div>

        <button className="order-subpage-submit btn--yellow" onTouchTap={this.onSubmitBtntap}>保存</button>
      </div>
    );
  },
});
