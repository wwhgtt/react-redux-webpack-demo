const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-index.js');
const ShowBasicInfo = require('../../component/mine/ShowBasicInfo.jsx');
const ShowMenuList = require('../../component/mine/ShowMenuList.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./mine-index.scss');

const MineIndexApplication = React.createClass({
  displayName: 'MineIndexApplication',
  getInitialState() {
    return {};
  },
  componentWillMount(){
  	const {getInfo}=this.props;
    getInfo();
  },
  render(){
  	const {Info,clearErrorMsg,errorMessage}=this.props;
  	return (
  		 <div> 
	  		 	<ShowBasicInfo Info={Info}/>
	  		 	<ShowMenuList/>
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

module.exports = connect(state => state, actions)(MineIndexApplication);
