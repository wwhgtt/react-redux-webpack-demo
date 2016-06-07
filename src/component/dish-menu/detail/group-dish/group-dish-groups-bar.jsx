const React = require('react');

module.exports = React.createClass({
  displayName: 'GroupDishGroupsBar',
  propTypes: {
    groupsData : React.PropTypes.array.isRequired,
    onGroupItemTap: React.PropTypes.func.isRequired,
  },
  buildGroupList(groupsData, onGroupItemTap) {
    const groupList = groupsData.map(groupData => {
      const { id, name, orderMin, orderMax } = groupData;
      return (
        <a key={id} className="groupItem">
          <span className="group-name">{name}</span>
          <span className="group-dish-limit">
            {orderMin !== orderMax ? `${orderMin}~` : false}
            {orderMax}份
          </span>
          <span className="group-dish-count">0</span>
        </a>);
    });
    return groupList;
  },
  render() {
    const { groupsData, onGroupItemTap } = this.props;
    const groupList = this.buildGroupList(groupsData, onGroupItemTap);
    return (
      <div className="group-dish-groups-bar">
        {groupList}
      </div>
    );
  },
});
