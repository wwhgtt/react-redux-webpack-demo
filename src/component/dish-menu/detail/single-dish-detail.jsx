const React = require('react');
const _cloneDeep = require('lodash.clonedeep');
const helper = require('../../../helper/dish-hepler');
const DishDetailItem = require('./dish-detail-item.jsx');
module.exports = React.createClass({
  displayName: 'SingleDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    const dishDataForState = _cloneDeep(this.props.dishData);
    if (!dishDataForState.hasOwnProperty('order')) {
      dishDataForState.order = [{ count:0 }];
    }
    return {
      dishData: dishDataForState,
    };
  },
  onDishItemCountChange(increament) {
    const oldState = this.state;
    const oldCount = helper.getDishesCount([oldState]);
    this.setState({ dishData: Object.assign({}, oldState, { order:[{ count: oldCount + increament }] }) });
  },
  render() {
    const { dishData } = this.state;
    return (
      <div className="single-dish-detail">
        <DishDetailItem dishData={dishData} onCountChange={this.onDishItemCountChange} />
      </div>
    );
  },
});
