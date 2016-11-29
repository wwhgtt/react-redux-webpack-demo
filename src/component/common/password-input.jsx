const React = require('react');
require('./password-input.scss');
// const classnames = require('classnames');

module.exports = React.createClass({
  displayName: 'PasswordInput',
  propTypes:{

  },
  getInitialState() {
    return { password: '' };
  },
  componentWillMount() {},
  componentDidMount() {},
  render() {
    // this.setState({value: Info.name});
    // const {  } = this.props;
    return (
      <div className="password-input">

      </div>
    );
  },
});
