/**
 * Created by Administrator on 2017/12/5.
 */
// exports.install = function (Vue) {
//   // var baseUrl =
//   Vue.prototype.ajax = function(url,params,callback){
//     Vue.$http.get(url, {
//       params:params, //请求参数
//       timeout:60*60*1000 //请求超时
//     }).then(function(response){
//       callback(null,response)
//     }, function(err){
//       callback(err);
//     })
//   }
// };
// export default{
//   MyPlugin.install=function(Vue){
//     Vue.prototype.$myName = "zhagngsan";
//   }
// }

export default{
  install(Vue){
    // Vue.prototype.$myName = "zhagngsan";
    Vue.prototype.checkUserName = (value) => {
      if(value == ""){
        return true; // 如果没有填写,默认为true
      }

      if(/\w{6,20}/.test(value)){
        return true;
      }else{
        return false;
      }
    }

    Vue.directive("uname",{
      bind(){
        console.log("bind"); // 只会调用一次
      },
      update(el,binding,vnode){
        console.log(el);
        console.log(binding);
        console.log(vnode);
      },
    })
  }
}

// var testjson = {
//   aa:'aaa',
//   bb:'bbb'
// }
// export { //很关键
//   testjson
// }



