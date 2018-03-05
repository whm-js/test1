/**
 * Created by Administrator on 2017/12/7.
 */
export default {
  install(Vue) {

    Vue.prototype.setGuid = function (guid) {
      setCookie('GUID', guid);
    }

    Vue.prototype.getGuid = function () {
      return getCookie('GUID');
    }

    Vue.prototype.setLocalStorageValue = function (name, value) {
      localStorage.setItem(name, JSON.stringify(value));
    }

    Vue.prototype.getLocalStorageValue = function (name) {
      return JSON.parse(localStorage.getItem(name));
    }

      Vue.prototype.removeLocalStorageValue = function (name) {
        localStorage.removeItem(name);
    }

    Vue.prototype.setcookie = function (name, value) {
      setCookie(name, value);
    }

    Vue.prototype.getcookie = function (name) {
      return getCookie(name);
    }

    Vue.prototype.$getLastDay = function (year, month) {
      var dt = new Date(year, month - 1, '01');
      dt.setDate(1);
      dt.setMonth(dt.getMonth() + 1);
      var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
      return cdt.getDate();
      //alert(cdt.getFullYear()+"年"+(Number(cdt.getMonth())+1)+"月月末日期:"+cdt.getDate()+"日");     
    }

    Vue.prototype.$formatDate = function (date, fmt) {
      var padLeftZero = function (str) {
        return ('00' + str).substr(str.length);
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
      }
      return fmt;
    };

    var getCookie = function (cookieName) {
      var value = null;
      var arr;
      var reg = new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)");
      arr = document.cookie.match(reg);
      if (arr) {
        value = unescape(arr[2]);
      }
      return (value) ? value : null;
    }

    /********************************************************************************
     函数名：setCookie
     功能：设置Cookie的值
     输入参数: name Cookie名称
     value Cookie值
     isSetTime 是否设置有效时间(可选参数),false为关闭浏览器自动删除此cookie
     返回值：无
     创建信息：谢建沅(2014-06-03)
     修改记录：无
     审查人：无
     *******************************************************************************/
    var setCookie = function (name, value, isSetTime) {
      if (isSetTime === undefined || isSetTime === true) {
        var day = 30;//默认cookie保存30天
        var date = new Date();
        date.setTime(date.getTime() + Number(day) * 24 * 60 * 60 * 1000);
        //document.cookie = name + "=" + escape(value) + ";domain=ksbao.com;path=/;expires = " + date.toGMTString();
        document.cookie = name + "=" + escape(value) + ";path=/;expires = " + date.toGMTString();
      } else {
        //document.cookie = name + "=" + escape(value) + ";domain=ksbao.com;path=/";
        document.cookie = name + "=" + escape(value) + ";path=/";
      }
    }

    Vue.prototype.encodeHtml = function (s) {
      var REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
      return (typeof s != "string") ? s :
        s.replace(REGX_HTML_ENCODE,
          function ($0) {
            var c = $0.charCodeAt(0), r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c); r.push(";");
            return r.join("");
          });
    };

    Vue.prototype.decodeHtml = function (s) {
      var REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
      var HTML_DECODE = {
        "<": "<",
        ">": ">",
        "&": "&",
        " ": " ",
        '"': "\"",
        "©": "©",
        "'": "'",
        "/": '/'
        // Add more
      };
      return (typeof s != "string") ? s :
        s.replace(REGX_HTML_DECODE,
          function ($0, $1) {
            var c = HTML_DECODE[$0]; // 尝试查表
            if (c === undefined) {
              // Maybe is Entity Number
              if (!isNaN($1)) {
                c = String.fromCharCode(($1 == 160) ? 32 : $1);
              } else {
                // Not Entity Number
                c = $0;
              }
            }
            return c;
          });
    };
  }
}
