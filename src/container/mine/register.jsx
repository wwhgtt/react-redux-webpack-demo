const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/register.js');
const RegisterBanner = require('../../component/mine/registerBanner.jsx');
const RegisterList = require('../../component/mine/registerList.jsx');
const PhoneInput=require('../../component/mui/phoneInput.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./register.scss');

const RegisterApplication = React.createClass({
  displayName: 'RegisterApplication',
  propTypes:{
  	Info:React.PropTypes.object,
  	getInfo:React.PropTypes.func,
  	updateInfo:React.PropTypes.func
  },
  getInitialState() {
    return {};
  },
  componentWillMount(){
  	
  },
  componentDidMount(){
  	const {getInfo}=this.props;
  	getInfo();
  },
  render(){
  	const {Info,getCode}=this.props;
  	return (
  		 <div> 
	  		 	<RegisterBanner Info={Info}/>
	  		 	<PhoneInput getCode={getCode} />
	  		 	<RegisterList Info={Info} />
  		 </div>
  	)
  	
  	
  	
  }
});

module.exports = connect(state => state, actions)(RegisterApplication);
