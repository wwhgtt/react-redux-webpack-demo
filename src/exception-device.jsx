const React = require('react');
const ReactDOM = require('react-dom');
const ExceptionDeviceApplication = require('./container/exception-device/application.jsx');
const injectTapEventPlugin = require('react-tap-event-plugin'); injectTapEventPlugin();

ReactDOM.render(
  <ExceptionDeviceApplication />,
  document.getElementById('app-placeholder')
);
