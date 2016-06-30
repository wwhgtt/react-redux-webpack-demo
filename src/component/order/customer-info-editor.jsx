const React = require('react');
const Counter = require('../mui/counter.jsx');
module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    customerProps:React.PropTypes.object.isRequired,
    onCountChange:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { customerProps } = this.props;
    return {
      customerProps:customerProps.set('id', 'customerInfoEditor'),
    };
  },
  componentDidMount() {

  },
  onCountChange(newCount, increment) {
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set('customerCount', newCount),
    });
  },
  onBtntap() {
    const { customerProps } = this.state;
    const { onCountChange } = this.props;
    onCountChange(null, customerProps);
  },
  handleChange(event) {
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set(event.target.getAttribute('name'), event.target.value),
    });
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="customer-info-editor">
        <div className="name-sex-mobile">
          <label htmlFor="name">姓名</label>
          <input name="name" id="name" placeholder={customerProps.name} onChange={this.handleChange} />
          <br />
          <input type="radio" name="sex" defaultValue="1" onChange={this.handleChange} defaultChecked={customerProps.sex === '1'} />
          <input type="radio" name="sex" defaultValue="0" onChange={this.handleChange} defaultChecked={customerProps.sex === '0'} />
          <br />
          <label htmlFor="mobile">联系电话</label>
          <input name="mobile" id="mobile" placeholder={customerProps.mobile} onChange={this.handleChange} />
        </div>
        <div className="numberOfGuests">
          <span>就餐人数</span>
          <Counter minimum={1} count={customerProps.customerCount} maximum={99} step={1} onCountChange={this.onCountChange} />
        </div>
        <button onTouchTap={this.onBtntap}>确定</button>
      </div>
    );
  },
});
