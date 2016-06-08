const React = require('react');
const classnames = require('classnames');
const helper = require('../../../../helper/dish-hepler');
require('./group-dish-groups-bar.scss');

module.exports = React.createClass({
  displayName: 'GroupDishGroupsBar',
  propTypes: {
    groupsData : React.PropTypes.array.isRequired,
    activeGroupIdx: React.PropTypes.number.isRequired,
    onGroupItemTap: React.PropTypes.func.isRequired,
  },
  buildGroupElements(activeGroupIdx, groupsData, onGroupItemTap) {
    const groupElements = groupsData.map((groupData, idx) => {
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
          <span className="group-dish-slide-badge">{helper.getDishCountInGroup(groupData)}</span>
        </li>);
    });
    return groupElements;
  },
  render() {
    const { activeGroupIdx, groupsData, onGroupItemTap } = this.props;
    const groupElements = this.buildGroupElements(activeGroupIdx, groupsData, onGroupItemTap);
    return (
      <div className="group-dish-slider-arrow">
        <div className="group-dish-slider-wrap">
          <ul className="group-dish-slider" style={{ width: `${1 / 3 * groupElements.length * 100}%` }}>
            {groupElements}
          </ul>
        </div>
      </div>
    );
  },
});
