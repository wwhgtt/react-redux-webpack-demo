const React = require('react');
const connect = require('react-redux').connect;
const bookDetailAction = require('../../action/book-detail/book-detail.js');

const BookDetailApplication = React.createClass({
  displayName: 'BookDetailApplication',
  propTypes: {

  },

  render() {
    return <div>asdf</div>;
  },

});

module.exports = connect(state => state, bookDetailAction)(BookDetailApplication);
