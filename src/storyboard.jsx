const React = require('react');
const ReactDOM = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();
const ActiveScrollSelect = require('./component/mui/select/active-scroll-select.jsx');
const DynamicClassAncor = require('./component/mui/misc/dynamic-class-hoc.jsx')('a');

ReactDOM.render(
  <div>
    <ActiveScrollSelect
      optionsData={[
        { id:1, label:'大厅区1' },
        { id:2, label:'大厅区2' },
        { id:3, label:'大厅区3' },
        { id:4, label:'大厅区4' },
      ]}
      onSelectOption={(evt, option) => console.log(111, option)}
      optionComponent={DynamicClassAncor}
    />

    {/* <DevTools />*/}
  </div>
  , document.getElementById('app-placeholder')
);
