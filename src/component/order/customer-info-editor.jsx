const React = require('react');
require('./customer-info-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    customerProps:React.PropTypes.object.isRequired,
    onCustomerPropsChange:React.PropTypes.func.isRequired,
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
    });
    onCustomerPropsChange(customerProps);
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="subpage flex-columns">
        <div className="flex-rest">
          <div className="options-group">
            <div className="option">
              <div className="editor-one-third">
                <span className="option-title">姓名：</span>
              </div>
              <div className="editor-two-thirds">
                <div className="option">
                  <input
                    className="editor-input"
                    name="name"
                    id="editor-name"
                    placeholder={customerProps.name}
                    onChange={this.handleBasicInfoChange}
                  />
                </div>
                <div className="option clearfix">
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
            </div>

            <label className="option">
              <span className="option-title">手机号：</span>
              <input className="editor-input" placeholder={customerProps.mobile} onChange={this.handleBasicInfoChange} disabled="disabled" />
            </label>
          </div>

        </div>

      </div>
    );
  },
});
