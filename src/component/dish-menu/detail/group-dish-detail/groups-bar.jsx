const React = require('react');
const classnames = require('classnames');
const helper = require('../../../../helper/dish-hepler');
const Toast = require('../../../../component/mui/toast.jsx');
require('./groups-bar.scss');

module.exports = React.createClass({
  displayName: 'GroupDishDetailGroupsBar',
  propTypes: {
    groups : React.PropTypes.array.isRequired,
    activeGroupIdx: React.PropTypes.number.isRequired,
    onGroupTap: React.PropTypes.func.isRequired,
    groupsValid: React.PropTypes.bool,
  },
  getInitialState() {
    return { toast: 0 };
  },
  buildGroupElements(activeGroupIdx, groups, onGroupTap) {
    const groupElements = groups.map((groupData, idx) => {
      const { id, name, orderMin, orderMax } = groupData;
      const isOverRestriction = (data) => {
        const orderedCount = helper.getDishesCount(data);
        if (orderedCount > orderMax || orderedCount < orderMin) return true;
        return false;
      };

      const isError = isOverRestriction(groupData.childInfos) && !this.props.groupsValid;
      return (
        <li
          key={id} data-idx={idx}
          className={classnames('group', { 'is-active':activeGroupIdx === idx, 'is-error':isError })}
          style={{
            WebkitFlex: `1 0 ${1 / groups.length * 100}%`,
            msFlex: `1 0 ${1 / groups.length * 100}%`,
            flex: `1 0 ${1 / groups.length * 100}%`,
          }}
          onTouchTap={onGroupTap}
        >
          <div className="group-text">
            <strong>{name}</strong>
            <small>
              {orderMin !== orderMax ? `${orderMin}~` : false}
              {orderMax}份
            </small>
          </div>
          <span
            className="group-badge"
            data-count={helper.getDishesCount(groupData.childInfos)}
            onTouchTap={isError ? this.showErrorMessage : false}
          ></span>
        </li>);
    });
    return groupElements;
  },
  showErrorMessage(evt) {
    evt.stopPropagation();
    this.setState({ toast: 1 });
  },
  clearErrorMessage() {
    this.setState({ toast: 0 });
  },
  render() {
    const { activeGroupIdx, groups, onGroupTap } = this.props;
    const groupElements = this.buildGroupElements(activeGroupIdx, groups, onGroupTap);
    return (
      <div className={classnames('groups-bar-arrow flex-none', { 'is-active': groupElements.length > 3 })}>
        <div className="groups-bar-wrap">
          <ul className="groups-bar flex-row" style={{ width: `${1 / 3 * groupElements.length * 100}%` }}>
            {groupElements}
          </ul>
        </div>
        {this.state.toast === 1 ? <Toast errorMessage="请选择足够的子菜份数" clearErrorMsg={this.clearErrorMessage} /> : false}
      </div>
    );
  },
});
