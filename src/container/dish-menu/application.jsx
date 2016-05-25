const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/dish-menu/dish-menu');

require('../../asset/style/style.scss');
require('./application.scss');

const DishTypeScroller = require('../../component/dish-menu/dish-type-scroller.jsx');
const DishMenuApplication = React.createClass({
  displayName: 'DishMenuApplication',
  propTypes: {
    // MapedActionsToProps
    fetchMenuData: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    dishTypesData: React.PropTypes.array,
    dishesData: React.PropTypes.array,
  },
  componentDidMount() {
    this.props.fetchMenuData();
  },
  render() {
    const { dishTypesData, dishesData } = this.props;
    return (
      <div className="application">
        <DishTypeScroller dishTypesData={dishTypesData} dishesData={dishesData} />
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(DishMenuApplication);
