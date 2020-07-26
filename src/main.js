// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'
Vue.config.productionTip = false


const firebaseConfig = {
  apiKey: "AIzaSyDbjR08ak2G383-RtlazHzuOeTRgAkfN30",
  authDomain: "notesandmore-943e9.firebaseapp.com",
  databaseURL: "https://notesandmore-943e9.firebaseio.com",
  projectId: "notesandmore-943e9",
  storageBucket: "notesandmore-943e9.appspot.com",
  messagingSenderId: "142919885745",
  appId: "1:142919885745:web:32bc64c6e3f8f8ed625390",
  measurementId: "G-7FLGBDCE7V"
};
firebase.initializeApp(firebaseConfig);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },

  template: '<App/>'
})
