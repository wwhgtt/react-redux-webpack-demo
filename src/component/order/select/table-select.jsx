const React = require('react');
const _findIndex = require('lodash.findindex');
const ActiveScrollSelect = require('../../mui/select/active-scroll-select.jsx');

module.exports = React.createClass({
  displayName: 'TableSelect',
  propTypes: {
    areas: React.PropTypes.array.isRequired,
    tables: React.PropTypes.array.isRequired,
    onTableSelect: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    let { areas, tables } = this.props;
    // if no area/table selected, we need to select the 1st area and 1st table of it.
    if (_findIndex(areas, { isChecked:true }) === -1) {
      const areaId = areas[0].id;
      const tableIdx = _findIndex(tables, { areaId });
      areas = areas.update(0, area => area.set('isChecked', true));
      tables = tables.update(tableIdx, table => table.set('isChecked', true));
    }

    return {
      areas,
      tables,
    };
  },
  onAreaSelect(area) {

  },
  onTableSelect(table) {

  },
  getTablesOfSelectedArea(areas, tables) {

  },
  render() {
    const { areas, tables } = this.state;
    const tablesOfArea = this.getTablesOfSelectedArea(areas, tables);
    return (
      <div className="table-select">
        <div className="headbar">
          <span className="headding">选择桌台</span>
          <a className="submit-btn">确定</a>
        </div>
        <ActiveScrollSelect optionsData={areas} />
        <ActiveScrollSelect optionsData={tablesOfArea} />
      </div>
    );
  },
});
