const React = require('react');
require('./list-item.scss');

const ListItem = React.createClass({
  displayName: 'ListItem',
  propTypes:{
    listContent:React.PropTypes.string.isRequired, // 进度条是否显示
  },
  componentWillMount() {},
  componentDidMount() {},
  render() {
    const { listContent } = this.props;
    return (
      <p className="list-term of">
        {
          listContent && (
            <span>
              <i className="cube fl">◆</i>
              <span className="content of">
                {listContent}
              </span>
            </span>
          )
        }
      </p>
  );
  },
});

module.exports = ListItem;
