const React = require('react');
require('./customer-info-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    customerProps:React.PropTypes.object.isRequired,
    onCustomerPropsChange:React.PropTypes.func.isRequired,
    isMobileDisabled:React.PropTypes.bool.isRequired,
  },
  getInitialState() {
    const { customerProps } = this.props;
    return {
      customerProps:customerProps.set('id', 'customer-info'),
    };
  },
  componentDidMount() {

  },
  componentWillReceiveProps(newProps) {
    this.setState(newProps);
  },
  handleBasicInfoChange(event) {
    const { customerProps } = this.state;
    const { onCustomerPropsChange } = this.props;
    this.setState({
      customerProps:customerProps.set(event.target.getAttribute('name'), event.target.value),
    }, function () { onCustomerPropsChange(this.state.customerProps); });
  },
  render() {
    const { customerProps } = this.state;
    const { isMobileDisabled } = this.props;
    return (
      <div className="editor options-group">
        <div className="option">
          <div className="flex-row">
            <span className="editor-title flex-none">姓名：</span>
            <input
              className="editor-input flex-rest"
              name="name"
              id="editor-name"
              placeholder={customerProps.name || '请输入姓名'}
              onChange={this.handleBasicInfoChange}
              maxLength="60"
            />
            <div className="editor-gender-group flex-none">
              <label className="half">
                <input
                  className="option-radio" type="radio" name="sex" defaultValue="0"
                  onChange={this.handleBasicInfoChange} checked={customerProps.sex === '0' || customerProps.sex === 0}
                />
                <span className="editor-gender">女士</span>
              </label>
              <label className="half">
                <input
                  className="option-radio" type="radio" name="sex" defaultValue="1"
                  onChange={this.handleBasicInfoChange} checked={customerProps.sex === '1' || customerProps.sex === 1}
                />
                <span className="editor-gender">先生</span>
              </label>
            </div>
          </div>
        </div>

        <div className="option">
          <div className="flex-row">
            <span className="editor-title flex-none">手机号：</span>
            <input
              name="mobile"
              className="editor-input editor-input--right flex-rest"
              value={customerProps.mobile ? customerProps.mobile : ''}
              placeholder={customerProps.mobile || '请输入手机号'}
              maxLength={11}
              onChange={this.handleBasicInfoChange}
              disabled={isMobileDisabled}
            />
          </div>
        </div>
      </div>
    );
  },
});
