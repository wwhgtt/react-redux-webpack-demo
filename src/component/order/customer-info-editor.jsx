const React = require('react');
const Counter = require('../mui/counter.jsx');

module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    onCountChange:React.PropTypes.func.isRequired,
  },
  componentDidMount() {

  },
  render() {
    const { onCountChange } = this.props;
    return (
      <div className="customer-info-editor">
        <div className="name-sex-phone">
          <label htmlFor="name">姓名</label>
          <input name="name" id="name" placeholder="您的姓名" />
          <br />
          <input type="radio" name="sex" defaultValue="male" defaultChecked />
          <input type="radio" name="sex" defaultValue="Female" />
          <br />
          <label htmlFor="phone">联系电话</label>
          <input name="phone" id="phone" placeholder="您的联系电话" />
        </div>
        <div className="numberOfGuests">
          <span>就餐人数</span>
          <Counter minimum={1} count={1} maximum={99} step={1} onCountChange={onCountChange} />
        </div>
        <button>确定</button>
      </div>
    );
  },
});
