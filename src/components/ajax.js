/**
 * Created by Administrator on 2017/12/5.
 */

var baseUrl = 'http://101.37.24.216:3009/' //服务器地址
if (location.hostname == 'newtest.ksbao.com' || location.hostname == 'localhost') {
  baseUrl = 'http://101.37.24.216:3003/'
}
export default {
  install(Vue) {
    /**
     * get请求，统一处理接口返回的状态码
     * @param url  请求路径
     * @param params 请求参数
     * @param callback
     * @param toUrl 登录失效前往的页面，默认/login
     */
    Vue.prototype.$httpGet = function (url, params, callback, toUrl) {
      var self = this
      var go = '/login';
      this.$Indicator.open('加载中...');
      this.$http.get(baseUrl + url, {
        params: params, //请求参数
        timeout: 60 * 60 * 1000,//请求超时

      }).then(function (response) {
        self.$Indicator.close();
        var data = JSON.parse(response.bodyText);
        if (data.status == 200 || data.status ==0) {
          callback(null, data)
        } else if (data.status == 201) {
          //登录失效
          if (data.msg === '登录状态失效，请重新登录。') {
            // self.removeLocalStorageValue('userinfo');
            self.$router.push(go);
          } else {
            this.$messagebox({
              title: '提示',
              message: data.msg,
              closeOnClickModal: false
            }).then(action => {
              self.$router.push(go);
            });
          }
        } else {
          self.$Toast({
            message: data.msg,
            position: 'top',
            duration: 2000
          });
          // callback(data.msg)
        }
      }, function (err) {
        self.$Indicator.close();
        callback(err);
      })
    }
    /**
     * post请求，统一处理接口返回的状态码
     * @param url  请求路径
     * @param body 请求参数
     * @param callback
     * @param toUrl 登录失效前往的页面，默认/login
     */
    Vue.prototype.$httpPost = function (url, body, callback, toUrl) {
      this.$Indicator.open('加载中...');
      var self = this
      var go = '/login';
      this.$http.post(baseUrl + url, body, {
        timeout: 60 * 60 * 1000, //请求超时
        emulateJSON: true  //请求会以application/x-www-form-urlencoded作为MIME type
      }).then(function (response) {
        self.$Indicator.close();
        var data = JSON.parse(response.bodyText);
        if (data.status == 200 || data.status ==0) {
          callback(null, data)
        } else if (data.status == 201) {

          //登录失效
          if (data.msg === '登录状态失效，请重新登录。') {
            self.$router.push(go);
          } else {
            this.$messagebox({
              title: '提示',
              message: data.msg,
              closeOnClickModal: false
            }).then(action => {
              self.$router.push(go);
            });
          }
        } else {
          self.$Toast({
            message: data.msg,
            position: 'top',
            duration: 2000
          });
          // callback(data.msg)
        }
      }, function (err) {
        self.$Indicator.close();
        callback(err);
      })
    }

  }
}




