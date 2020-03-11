import "./firebase";
import Vue from "vue";
import VueFire from "vuefire";
import firebase from "firebase";
import VueJsonToCsv from 'vue-json-to-csv'
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import JsonExcel from "vue-json-excel";
 import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.config.productionTip = false;

library.add(faCheck);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("downloadExcel", JsonExcel);

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: h => h(App),
  }).$mount("#app");
});

Vue.use(BootstrapVue);
Vue.use(VueFire);
Vue.use(VueJsonToCsv);
