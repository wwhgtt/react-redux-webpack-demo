const React = require('react');
const _cloneDeep = require('lodash.clonedeep');
const helper = require('../../../../helper/dish-hepler');
const DishDetailItem = require('../dish-detail-item.jsx');
const GroupDishGroupsBar = require('./group-dish-groups-bar.jsx');

module.exports = React.createClass({
  displayName: 'GroupDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const dishDataForDetail = _cloneDeep(this.props.dishData);

    dishDataForDetail.order = [
      {
        count:0,
        groups: dishDataForDetail.groups,
      },
    ];

    dishDataForDetail.groups.forEach(group => {
      group.childInfos.forEach(childDish => {
        childDish.order = 0;
      });
    });

    return {
      dishData: dishDataForDetail,
    };
  },
  componentDidMount() {
  },
  onGroupDishCountChange(increment) {
    const dishDataForDetail = this.state.dishData;
    const dishDataForCart = this.props.dishData;
    const orderDataForDetail = dishDataForDetail.order;
    const countForDetail = helper.getDishesCount([dishDataForDetail]);
    const countForCart = helper.getDishesCount([dishDataForCart]);
    let newCountForDetail;

    if (countForDetail === 0 && countForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishDataForDetail.dishIncreaseUnit;
    } else if (countForCart === 0 && countForDetail + increment < dishDataForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = countForDetail + increment;
    }
    const newOrderData = [Object.assign({}, orderDataForDetail[0], { count: newCountForDetail })];
    this.setState({ dishData: Object.assign({}, dishDataForDetail, { order:newOrderData }) });
  },
  onGroupItemTap(groupData) {
  },
  render() {
    const { dishData } = this.state;
    return (
      <div className="group-dish-detail">
        <DishDetailItem dishData={dishData} onCountChange={this.onGroupDishCountChange} />
        <GroupDishGroupsBar groupsData={dishData.groups} onGroupItemTap={this.onGroupItemTap} />
      </div>
    );
  },
});
