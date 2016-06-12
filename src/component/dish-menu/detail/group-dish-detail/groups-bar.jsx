const React = require('react');
const classnames = require('classnames');
const helper = require('../../../../helper/dish-hepler');
require('./groups-bar.scss');

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
          className={classnames('group', { 'is-active':activeGroupIdx === idx })}
          style={{ width: `${1 / groupsData.length * 100}%` }}
          onTouchTap={onGroupItemTap}
        >
          <div className="group-text">
            <strong>{name}</strong>
            <small>
              {orderMin !== orderMax ? `${orderMin}~` : false}
              {orderMax}份
            </small>
          </div>
          <span className="group-badge">{helper.getDishesCount(groupData.childInfos)}</span>
        </li>);
    });
    return groupElements;
  },
  render() {
    const { activeGroupIdx, groupsData, onGroupItemTap } = this.props;
    const groupElements = this.buildGroupElements(activeGroupIdx, groupsData, onGroupItemTap);
    return (
      <div className="groups-bar-arrow">
        <div className="groups-bar-wrap">
          <ul className="groups-bar" style={{ width: `${1 / 3 * groupElements.length * 100}%` }}>
            {groupElements}
          </ul>
        </div>
      </div>
    );
  },
});
