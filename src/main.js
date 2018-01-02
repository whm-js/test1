// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import iconfont from './assets/icon/iconfont.css'

import vueResource from 'vue-resource'
Vue.use(vueResource);

import ajax from "./components/ajax";
Vue.use(ajax);

import G_Cookie from "./components/yingSoftCookie";
Vue.use(G_Cookie);

import {Base64} from 'js-base64';
Vue.prototype.Base64 = Base64;
import { Indicator } from 'mint-ui';
import { Header } from 'mint-ui';
import { Tabbar, TabItem } from 'mint-ui';
import { Button } from 'mint-ui';
import { TabContainer, TabContainerItem } from 'mint-ui';
import { Field } from 'mint-ui';
import { Cell } from 'mint-ui';
import { CellSwipe } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import { Spinner } from 'mint-ui';
import { Badge } from 'mint-ui';
import { Picker } from 'mint-ui';
import { Popup } from 'mint-ui';
import { Toast } from 'mint-ui';
import { Rate } from 'element-ui';
// Vue.use(Icon)
Vue.use(Rate)

Vue.component(Cell.name, Cell);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Button.name, Button);
Vue.component(Header.name, Header);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Field.name, Field);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Badge.name, Badge);
Vue.component(Picker.name, Picker);
import { Radio } from 'mint-ui';
Vue.component(Radio.name, Radio);

import { DatetimePicker } from 'mint-ui';
Vue.component(DatetimePicker.name, DatetimePicker);



Vue.component(Spinner.name, Spinner);
Vue.component(Popup.name, Popup);

Vue.$messagebox = Vue.prototype.$messagebox = MessageBox;
Vue.$Indicator = Vue.prototype.$Indicator = Indicator;
Vue.$Toast = Vue.prototype.$Toast = Toast;
Vue.config.productionTip = false
//import {httpget,httppost} from '../assets/js/ajax' //注意路径
//Vue.prototype.httpget = httpget;
//Vue.prototype.httppost = httppost;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,//使用store
  template: '<App/>',
  components: { App }
})
