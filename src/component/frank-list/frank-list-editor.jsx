const React = require('react');

//const actions = require('../../action/frank-list/frank-list');
require('./frank-list-editor.scss');

var AJList = React.createClass({
  displayName: 'AJList',
  propTypes: {
    //customerProps:React.PropTypes.object,
  },
  componentWillMount(){
  	
  	
  },
  componentDidMount() {
  	//const {AJFUN}=this.props;
  	//AJFUN("");
  },
  handleClick(event) {
  	//console.log(this.props)
  	const {AJFUN}=this.props;
  	AJFUN("");
  },
  handleClear(event){
  	
  	const {AJDelete}=this.props;
  	AJDelete("");
  	
  },
  render() {
    const { list,customerProps } = this.props;
    console.log(this.props)
    let refresh={"padding":"0.5em","color":"#fff","fontSize":"14px","display":"inline-block","background":"#3495ee","borderRadius":"3px"};
    return(
    	<div style={{"padding":"1em"}}>
    	   <ul className="search-ul">
    	   {
    	      list.map(function(str){
							  return (
							  	 <li key={str.id}>
							  	   {str.name}
							  	 </li>
							  	 );
							  })
    	     }
    	   </ul>
    	   <p style={refresh} onClick={this.handleClick}>刷新列表</p>
    	   <p style={refresh} onClick={this.handleClear}>清空列表</p>
    	   <p>{customerProps.name}{customerProps.age}</p>
    	</div>
    	
    	
    )
  },
});

module.exports=AJList;