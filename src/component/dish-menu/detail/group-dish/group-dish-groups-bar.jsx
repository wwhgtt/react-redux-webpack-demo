const React = require('react');

require('./group-dish-groups-bar.scss');

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
        <li key={id} className="group-dish-slide" style={{ width: `${1 / groupsData.length * 100}%` }}>
          <div className="group-dish-slide-text">
            <strong>{name}</strong>
            <small>
              {orderMin !== orderMax ? `${orderMin}~` : false}
              {orderMax}份
            </small>
          </div>
          <span className="group-dish-slide-badge">0</span>
        </li>);
    });
    return groupList; // just a test
  },
  render() {
    const { groupsData, onGroupItemTap } = this.props;
    const groupList = this.buildGroupList(groupsData, onGroupItemTap);
    return (
      <div className="group-dish-slider-wrap">
        <ul className="group-dish-slider" style={{ width: `${1 / 3 * groupList.length * 100}%` }}>
          {groupList}
        </ul>
      </div>
    );
  },
});
