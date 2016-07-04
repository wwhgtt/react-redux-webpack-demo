const React = require('react');
const _find = require('lodash.find');
const _findIndex = require('lodash.findindex');
const ActiveScrollSelect = require('../../mui/select/active-scroll-select.jsx');
const AreaOption = require('./area-option.jsx');
const TableOption = require('./table-option.jsx');

require('./select-container.scss');

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
    const { areas } = this.state;
    this.setState({
      areas: areas.flatMap(
        eachArea => eachArea.id === area.id ? eachArea.set('isChecked', true) : eachArea.set('isChecked', false)
      ),
    });
  },
  onTableSelect(table) {
    const { tables } = this.state;
    this.setState({
      tables: tables.flatMap(
        eachTable => eachTable.id === table.id ? eachTable.set('isChecked', true) : eachTable.set('isChecked', false)
      ),
    });
  },
  onSubmit() {
    const { onTableSelect } = this.props;
    const { areas, tables } = this.state;
    onTableSelect({
      area: _find(areas, { isChecked:true }),
      table: _find(tables, { isChecked:true }),
    });
  },
  getTablesOfSelectedArea(areas, tables) {
    const selectedArea = _find(areas, { isChecked:true });
    return tables.filter(table => table.areaId === selectedArea.id);
  },
  render() {
    const { areas, tables } = this.state;
    const tablesOfArea = this.getTablesOfSelectedArea(areas, tables);
    return (
      <div className="scroll-select-container">
        <div className="scroll-select-header">
          <span>选择地区</span>
          <div className="scroll-select-confirm btn--yellow" onTouchTap={this.onSubmit}>确定</div>
        </div>
        <div className="scroll-select-content flex-row">
          <ActiveScrollSelect
            className="flex-area-select"
            optionsData={areas}
            optionComponent={AreaOption}
            onSelectOption={this.onAreaSelect}
          />
          <ActiveScrollSelect
            className="flex-table-select"
            optionsData={tablesOfArea}
            optionComponent={TableOption}
            onSelectOption={this.onTableSelect}
          />
        </div>
      </div>
    );
  },
});
