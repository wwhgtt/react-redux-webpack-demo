const React = require('react');
const helper = require('../../../helper/dish-hepler');
const Counter = require('../../mui/counter.jsx');
module.exports = React.createClass({
  displayName: 'DishDetailItem',
  propTypes: {
    dishData: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    const { dishData } = this.props;
    return {
      count: helper.getDishesCount([dishData]),
    };
  },
  onCountChange() {
    // TODO
  },
  render() {
    const { dishData } = this.props;
    const { count } = this.state;
    return (
      <div className="dish-detail-item">
        <span href="" className="total-price"></span>
        <span className="name"></span>
        <span className="origin-price"></span>
        <Counter count={count} onCountChange={this.onCountChange} step={dishData.stepNum} />
      </div>
    );
  },
});
