var getDate=function(){
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today  = new Date();
    var day=today.toLocaleDateString("en-US", options);  
    return day;
}
//simply exports can also be used
// exports.getDate=one function
// exports.pick=some other function
module.exports=getDate;