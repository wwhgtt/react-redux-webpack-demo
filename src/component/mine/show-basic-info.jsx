const React = require('react');

const malePic = require('../../asset/images/head-male.png');
const femalePic = require('../../asset/images/head-female.png');
const defaultPic = require('../../asset/images/head-default.png');

require('./show-basic-info.scss');

module.exports = React.createClass({ // ShowBasicInfo
  displayName: 'ShowBasicInfo',
  propTypes:{
    info:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return { realImage : '', realSex : '' };
  },
  componentWillMount() { },
  componentDidMount() { },
  componentWillReceiveProps(nextProps) {   // 接收props
    if (JSON.stringify(this.props.info) === JSON.stringify(nextProps.info)) {
      return;
    }
    // 获取Icon
    if (nextProps.info.iconUri) {
      this.setState({ realImage : nextProps.info.iconUri });
    } else if (nextProps.info.sex === '1') {
      this.setState({ realImage : malePic });
    } else if (nextProps.info.sex === '0') {
      this.setState({ realImage : femalePic });
    } else {
      this.setState({ realImage : defaultPic });
    }
    // 转义性别
    if (nextProps.info.sex === '1') {
      this.setState({ realSex : '先生' });
    } else if (nextProps.info.sex === '0') {
      this.setState({ realSex : '女士' });
    }
  },
  imgError(sex, e) {
    switch (sex) {
      case '1': { this.setState({ realImage : malePic }); break; }
      case '0': { this.setState({ realImage : femalePic }); break; }
      default: { this.setState({ realImage : defaultPic }); break; }
    }
  },
  render() {
    const { info } = this.props;
    const { realImage, realSex } = this.state;
    return (
      <div className="basicInfoBg">
        <div className="basicInfoBg-imgouter">
          <img className="basicInfoBg-img" src={realImage} alt="用户头像" title={info.name || ''} ref="logo" onError={() => this.imgError(info.sex)} />
          {
            info.isMember && <div className="basicInfoBg-vip">VIP</div>
          }
        </div>
        <p className="basicInfoBg-name ellipsis">
          {info.name || '匿名用户'} {info.mobile && info.name ? realSex : ''}
        </p>
      </div>
    );
  },
});
