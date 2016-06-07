const React = require('react');
const classnames = require('classnames');
require('./group-dish-groups-bar.scss');

module.exports = React.createClass({
  displayName: 'GroupDishGroupsBar',
  propTypes: {
    groupsData : React.PropTypes.array.isRequired,
    activeGroupIdx: React.PropTypes.number.isRequired,
    onGroupItemTap: React.PropTypes.func.isRequired,
  },
  buildGroupList(activeGroupIdx, groupsData, onGroupItemTap) {
    const groupList = groupsData.map((groupData, idx) => {
      const { id, name, orderMin, orderMax } = groupData;
      return (
        <li
          key={id} data-idx={idx}
          className={classnames('group-dish-slide', { 'is-active':activeGroupIdx === idx })}
          style={{ width: `${1 / groupsData.length * 100}%` }}
          onTouchTap={onGroupItemTap}
        >
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
    return groupList;
  },
  render() {
    const { activeGroupIdx, groupsData, onGroupItemTap } = this.props;
    const groupList = this.buildGroupList(activeGroupIdx, groupsData, onGroupItemTap);
    return (
      <div className="group-dish-slider-wrap">
        <ul className="group-dish-slider" style={{ width: `${1 / 3 * groupList.length * 100}%` }}>
          {groupList}
        </ul>
      </div>
    );
  },
});
