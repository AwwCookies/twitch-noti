<template>
  <div id="backup">
    <h1>Backup and Restore</h1>
    <textarea v-model="content" id="ta"></textarea>
    <h3 v-bind="text"></h3>
    <button v-on:click="getData">Copy</button>
    <button v-on:click="loadData">Load</button>
  </div>
</template>

<script>

import {saveAs} from "file-saver"

export default {
  data() {
    return {
      content: "this is content",
      text: "",
      file1: null
    };
  },
  created() {
    chrome.storage.sync.get(null, (items) => {
      this.content = JSON.stringify(items);
      this.text = "copy pasta"
    });
  },
  methods: {
    getData() {
        var copyText = document.querySelector("#ta");
        copyText.select();
        document.execCommand("copy");
    },
    loadData() {
      const items = JSON.parse(this.content);
      chrome.runtime.sendMessage({ type: "load", settings: items })
    },
  },
};
</script>

<style scoped>
#ta {
  width: 100%;
}
#backup {
  text-align: left;
  width: 500px;
  max-width: 500px;
}
</style>