const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-setting.js');
const ShowSettingList = require('../../component/mine/ShowSettingList.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./mine-setting.scss');

const MineSettingApplication = React.createClass({
  displayName: 'MineSettingApplication',
  propTypes:{
  	Info:React.PropTypes.object,
  	getInfo:React.PropTypes.func,
  	updateInfo:React.PropTypes.func
  },
  getInitialState() {
    return {};
  },
  componentWillMount(){
  	const {getInfo}=this.props;
    getInfo();
  },
  render(){
  	const {Info,updateInfo,logOff,clearErrorMsg,errorMessage}=this.props;
  	return (
  		 <div> 
	  		 	<ShowSettingList Info={Info} updateInfo={updateInfo} logOff={logOff}/>
	  		 	{
	  		 	errorMessage?
	  		 	<Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage}/>
	  		 	:
	  		 	false
  		    }
  		 </div>
  	)
  	
  	
  	
  }
});

module.exports = connect(state => state, actions)(MineSettingApplication);
