<template>
  <div>
    <h1>Settings</h1>
    <div id="settings">
      <b-form-checkbox
        v-model="notifications"
        value=true
        unchecked-value=false
      >
        Notifications
      </b-form-checkbox>
      <label for="tags-channel">Channels</label>
      <b-form-tags tag-variant="dark"
        @input="onChannelInput"
        separator=" ,;"
        remove-on-delete
        input-id="tags-channel"
        v-model="channels">
      </b-form-tags>
      <label for="tags-matches">Matches</label>
      <b-form-tags tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-matches"
        v-model="matches">
      </b-form-tags>
      <label for="tags-regexMatches">Regex Matches</label>
      <b-form-tags tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-regexMatches"
        v-model="regexMatches">
      </b-form-tags>
      <label for="tags-ignore">Ignored</label>
      <b-form-tags tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-matches"
        v-model="ignored">
      </b-form-tags>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: [],
      matches: [],
      regexMatches: [],
      ignored: [],
      notifications: false,
    };
  },
  methods: {
    onChannelInput(value) {
      console.log('dksajfdskjfsadkjfdksjafsdjafksdjf', value)
      this.channels = value.map((channel) => {
        if (channel.startsWith("#")) {
          return channel
        } else {
          return "#" + channel
        }
      })
    },
  },
  created() {
    chrome.storage.sync.get(Object.keys(this.$data), (newData) => {
      Object.assign(this.$data, newData)
    }) 
  },
  watch: {
    channels(value) {
      // prepend '#' to channels
      value = value.map((channel) => {
        if (channel.startsWith("#")) {
          return channel
        } else {
          return "#" + channel
        }
      })
      chrome.storage.sync.set({"channels": value})
      chrome.runtime.sendMessage({ type: "join", channels: value })
    },
    matches(value) {
      chrome.storage.sync.set({"matches": value})
    },
    regexMatches(value) {
      chrome.storage.sync.set({"regexMatches": value})
    },
    ignored(value) {
      chrome.storage.sync.set({"ignored": value})
    },
    notifications(value) {
      value = (value === "false") ? false : true
      chrome.storage.sync.set({"notifications": value})
    }
  }
};
</script>

<style scoped>
#settings {
  text-align: left;
  width: 500px;
  max-width: 500px;
}
</style>