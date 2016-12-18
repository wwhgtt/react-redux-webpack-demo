const React = require('react');
const classnames = require('classnames');

const CommentStar = React.createClass({
  displayName: 'CommentStar',
  propTypes: {
    starTotal: React.PropTypes.number, // star总个数
    commentScore: React.PropTypes.number, // 评分分数
    onSelectStar: React.PropTypes.func, // 选择评分
  },

  getInitialState() {
    return {
      // score: 0,
    };
  },

  // 评分
  getStars() {
    const { starTotal, commentScore } = this.props;
    const stars = [];
    for (let i = 0; i < starTotal; i ++) {
      const starItem = (
        <a
          key={i}
          className={classnames('comment-content-star', { 'star-mark': commentScore > i })}
          onTouchTap={() => this.selectStar(i)}
        ></a>
      );
      stars.push(starItem);
    }

    return stars;
  },

  selectStar(i) {
    const { onSelectStar } = this.props;
    if (onSelectStar) {
      onSelectStar(i);
    }
  },

  render() {
    return <div>{this.getStars()}</div>;
  },
});

module.exports = CommentStar;
