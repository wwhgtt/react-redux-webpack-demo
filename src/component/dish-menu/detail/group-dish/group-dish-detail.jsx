const React = require('react');
const Immutable = require('seamless-immutable');
const helper = require('../../../../helper/dish-hepler');
const DishDetailItem = require('../dish-detail-item.jsx');
const GroupDishGroupsBar = require('./group-dish-groups-bar.jsx');
const GroupDishChildItem = require('./group-dish-child-item.jsx');

module.exports = React.createClass({
  displayName: 'GroupDishDetail',
  propTypes:{
    dishData: React.PropTypes.object.isRequired,
    onAddToCarBtnTap: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { dishData } = this.props;
    const dishDataForDetail = dishData.setIn(
      ['order'],
      Immutable.from([
        {
          count:0,
          groups: dishData.groups,
        },
      ])
    ).updateIn( // process each childDish, if it is default dish, make its order count to its leastCellNum.
      ['order', 0, 'groups'],
      groups => groups.flatMap(
        group => group.update(
          'childInfos', childDishes => childDishes.flatMap(
            childDish => childDish.isDefault || childDish.isReplace ? childDish.set('order', childDish.leastCellNum) : childDish.set('order', 0)
          )
        )
      )
    );
    return {
      activeGroupIdx:0,
      dishData: dishDataForDetail,
    };
  },
  componentDidUpdate() {
  },
  onGroupDishCountChange(increment) {
    const dishDataForDetail = this.state.dishData;
    const oldDishDataForCart = this.props.dishData;
    const oldCountForDetail = helper.getDishesCount([dishDataForDetail]);
    const oldCountForCart = helper.getDishesCount([oldDishDataForCart]);
    let newCountForDetail;
    if (oldCountForDetail === 0 && oldCountForCart === 0) {
      // if never ordered this dish;
      newCountForDetail = dishDataForDetail.dishIncreaseUnit;
    } else if (oldCountForCart === 0 && oldCountForDetail + increment < dishDataForDetail.dishIncreaseUnit) {
      // if never ordered this dish and now want to order a count that is smaller thant dishIncreaseUnit;
      newCountForDetail = 0;
    } else {
      newCountForDetail = oldCountForDetail + increment;
    }
    this.setState({ dishData: dishDataForDetail.setIn(
      ['order', 0, 'count'],
      newCountForDetail
    ) });
  },
  onChildDishCountChange(dishData, increment) {
    const { activeGroupIdx } = this.state;
    const groupDish = this.state.dishData;
    const oldCount = helper.getDishesCount([dishData]);
    let newCount;
    if (oldCount === 0) {
      newCount = dishData.leastCellNum;
    } else if (oldCount + increment < dishData.leastCellNum) {
      newCount = 0;
    } else {
      newCount = oldCount + increment;
    }
    this.setState({ dishData:groupDish.updateIn(
      ['order', 0, 'groups', activeGroupIdx, 'childInfos'],
      childDishes => childDishes.flatMap(childDish => childDish.id === dishData.id ? childDish.set('order', newCount) : childDish)
    ) });
  },
  onGroupItemTap(evt) {
    const idx = evt.currentTarget.getAttribute('data-idx');
    this.setState({ activeGroupIdx:parseInt(idx, 10) });
  },
  buildGroupDishes(groupData) {
    const remainCount = groupData.orderMax - helper.getDishCountInGroup(groupData);
    return groupData.childInfos.map(childDish => {
      return (<GroupDishChildItem
        key={childDish.id} dishData={childDish} remainCount={remainCount} onDishItemCountChange={this.onChildDishCountChange}
      />);
    });
  },
  render() {
    const { activeGroupIdx, dishData } = this.state;
    const activeGroupDishes = this.buildGroupDishes(dishData.order[0].groups[activeGroupIdx]);
    return (
      <div className="group-dish-detail">
        <DishDetailItem dishData={dishData} onCountChange={this.onGroupDishCountChange} />
        <GroupDishGroupsBar groupsData={dishData.order[0].groups} activeGroupIdx={activeGroupIdx} onGroupItemTap={this.onGroupItemTap} />
        <div className="group-dishes-container">
          {activeGroupDishes}
        </div>
      </div>
    );
  },
});
