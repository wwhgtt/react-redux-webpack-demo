const React = require('react');
const classnames = require('classnames');
const helper = require('../../../../helper/dish-hepler');
require('./groups-bar.scss');

module.exports = React.createClass({
  displayName: 'GroupDishDetailGroupsBar',
  propTypes: {
    groups : React.PropTypes.array.isRequired,
    activeGroupIdx: React.PropTypes.number.isRequired,
    onGroupTap: React.PropTypes.func.isRequired,
  },
  buildGroupElements(activeGroupIdx, groups, onGroupTap) {
    const groupElements = groups.map((groupData, idx) => {
      const { id, name, orderMin, orderMax } = groupData;
      const isOverRestriction = (data) => {
        const orderedCount = helper.getDishesCount(data);
        if (orderedCount > orderMax || orderedCount < orderMin) return true;
        return false;
      };

      return (
        <li
          key={id} data-idx={idx}
          className={classnames('group', { 'is-active':activeGroupIdx === idx, 'is-error':isOverRestriction(groupData.childInfos) })}
          style={{ width: `${1 / groups.length * 100}%` }}
          onTouchTap={onGroupTap}
        >
          <div className="group-text">
            <strong>{name}</strong>
            <small>
              {orderMin !== orderMax ? `${orderMin}~` : false}
              {orderMax}份
            </small>
          </div>
          <span className="group-badge" data-count={helper.getDishesCount(groupData.childInfos)}></span>
        </li>);
    });
    return groupElements;
  },
  render() {
    const { activeGroupIdx, groups, onGroupTap } = this.props;
    const groupElements = this.buildGroupElements(activeGroupIdx, groups, onGroupTap);
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
