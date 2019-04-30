import Vue from "vue";
import App from "./App.vue";
import iView from "iview";
import "iview/dist/styles/iview.css";
import axios from "axios";
import animated from 'animate.css';
import common from './assets/js/common.js';
// import Blob from "@/excel/Blob.js"; 
// import Export2Excel from "@/excel/Export2Excel.js";
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'; // 修改Content-Type为application/x-www-form-urlencoded
Vue.use(common);
// axios.defaults.baseURL = "http://10.8.49.143:8081/typhoon";
Vue.prototype.$axios = axios; //axios 改写为 Vue 的原型属性

Vue.use(iView);
Vue.use(animated);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
