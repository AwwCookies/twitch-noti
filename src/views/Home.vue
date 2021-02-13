<template>
  <div id="home">
    <b-table ref="table" sticky-header striped hover dark :items="pings" :fields="fields">
      <template #cell(message)="row">
        <twitch-message v-bind:data="row"/>
      </template>
      <template #cell(time)="row">
        <span v-b-tooltip 
          :title="convertUnixToMoment(row.item.time).format('MMMM Do YYYY, h:mm:ss a')">
          {{convertUnixToMoment(row.item.time).fromNow()}}
        </span>
      </template>
      <template #cell(Action)="row">
        <b-button size="sm" @click="del(row.item.id)" class="mr-2" variant="danger">
          <b-icon icon="trash-fill" shift-v="-2" aria-hidden="true">
        </b-button>
      </template>
    </b-table>
    <b-button v-on:click="clear" block id="btnClear">Clear</b-button>
    <b-button v-on:click="reload" block variant="primary">Reload</b-button>
  </div>
</template>

<script>
import moment from "moment"

import TwitchMessage from '../components/TwitchMessage.vue';
export default {
  name: "App",
  components: {
    TwitchMessage
  },
  data() {
    return {
      fields: ["channel", "user", "message", "time", "Action"],
      pings: [],
    };
  },
  methods: {
    convertUnixToMoment(uts) {
      return moment(new Date(uts))
    },
    test(data) {
      return data
    },
    reload() {
      const $vm = this;
      chrome.runtime.sendMessage({ type: "reload" }, (res) => {
        $vm.pings = res
      });
    },
    clear() {
      console.log("clearning messages");
      const $vm = this
      chrome.runtime.sendMessage({ type: "clear" }, (res) => {
        $vm.pings = res;
      });
    },
    del(id) {
      console.log(`Removing row with id of ${id}`);
      const $vm = this;
      chrome.runtime.sendMessage({ type: "remove", id: id }, (res) => {
          $vm.pings = res;
      });
    },
  },
  created() {
    // browser.runtime.sendMessage({ type: "join", channels: ["PrincessAww"] })
  },
  mounted() {
    console.log(this.$refs.table);
    let myPort = null
    myPort = chrome.runtime.connect({ name: "port-from-cs" });
    
    let $vm = this;
    myPort.onMessage.addListener(function (m) {
      $vm.pings = m;
    });
  },
};
</script>

<style scoped>
#btnClear {
  background-color: #9147ff;
  color: white;
}
#home {
  text-align: left;
  width: 800px;
  max-width: 800px;
}
</style>
