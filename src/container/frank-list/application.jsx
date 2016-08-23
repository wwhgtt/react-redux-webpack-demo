const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/frank-list/frank-list');
const AJSearch = require('../../component/frank-list/frank-search-editor.jsx');
const AJList = require('../../component/frank-list/frank-list-editor.jsx');
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');

const FrankListApplication = React.createClass({
  displayName: 'FrankListApplication',
  getInitialState() {
    return {};
  },
  componentDidMount(){
  	
  },
  render(){
  	const { customerProps, list,errorMessage,AJFUN,AJDelete,getId} = this.props;
  	
  	return (
  		
  		 <div>
  		    <AJSearch getId={getId}/>
  		    <AJList customerProps={customerProps} list={list} AJFUN={AJFUN} AJDelete={AJDelete} />
  		 </div>
  	)
  	
  	
  	
  }
});

module.exports = connect(state => state, actions)(FrankListApplication);
