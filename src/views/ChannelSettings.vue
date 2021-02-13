<template>
  <div id="csettings">
    <h1>Channel Settings</h1>
    <b-form-checkbox
      v-model="notifications"
      value="true"
      unchecked-value="false"
    >
      Notifications
    </b-form-checkbox>
    <b-form-select
      v-model="channel"
      v-on:input="channelChanged"
      :options="channels"
    >
    </b-form-select>
    <template v-if="channel">
      <label for="tags-matches">Matches</label>
      <b-form-tags
        tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-matches"
        v-model="matches"
      >
      </b-form-tags>
      <label for="tags-regexMatches">Regex Matches</label>
      <b-form-tags tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-regexMatches"
        v-model="regexMatches">
      </b-form-tags>
      <label for="tags-ignore">Ignored</label>
      <b-form-tags
        tag-variant="dark"
        separator=" ,;"
        remove-on-delete
        input-id="tags-matches"
        v-model="ignored"
      >
      </b-form-tags>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channel: "",
      channels: [],
      ignored: [],
      matches: [],
      regexMatches: [],
      notifications: false,
    };
  },
  watch: {
    ignored(value) {{this.updateLocal()}},
    matches(value) {{this.updateLocal()}},
    notifications(value) {this.updateLocal()},
    regexMatches(value) {this.updateLocal()},
  },
  methods: {
    channelChanged(channel) {
      console.log(`Current channel: ${channel}`);
      chrome.storage.sync.get([channel], (data) => {
        Object.assign(this.$data, data[channel]);
      });
    },
    updateLocal() {
      const loc = {
        [this.channel]: {
          ignored: this.ignored,
          matches: this.matches,
          regexMatches: this.regexMatches,
          notifications: this.notifications,
        },
      }
      chrome.storage.sync.set(loc);
    },
  },
  created() {
    chrome.storage.sync.get(["channels"], (data) => {
      this.channels = data.channels;
      if (!this.channels) {
        this.channel = ""
      } else {
        this.channel = this.channels.length > 0 ? this.channels[0] : "";
      }
      
    });
  },
};
</script>

<style scoped>
#csettings {
  text-align: left;
  width: 500px;
  max-width: 500px;
}
</style>