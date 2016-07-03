require('core-js/shim');
const React = require('react');
const ReactDOM = require('react-dom');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();
const ActiveScrollSelect = require('./component/mui/select/active-scroll-select.jsx');
const DynamicClassAncor = require('./component/mui/misc/dynamic-class-hoc.jsx')('a');

window.onload = () => {
  ReactDOM.render(
    <div>
      <ActiveScrollSelect
        optionsData={[
          { id:1, label:'大厅区1' },
          { id:2, label:'大厅区2', isChecked:true },
          { id:3, label:'大厅区3' },
          { id:4, label:'大厅区4' },
          { id:5, label:'大厅区5' },
          { id:6, label:'大厅区6' },
          { id:7, label:'大厅区7' },
          { id:8, label:'大厅区8' },
          { id:9, label:'大厅区9' },
          { id:10, label:'大厅区10' },
        ]}
        onSelectOption={(evt, option) => console.log(111, option)}
        optionComponent={DynamicClassAncor}
      />

      {/* <DevTools />*/}
    </div>
    , document.getElementById('app-placeholder')
  );
};
