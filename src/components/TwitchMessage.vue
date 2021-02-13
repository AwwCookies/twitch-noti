<template>
  <div class="hello">
    <p v-html="getMsg()"></p>
  </div>
</template>

<script>
import emoteParser from "../assets/js/twitch-emotes"
import xss from "xss"


export default {
  name: 'TwitchMessage',
  props: {
    data: String
  },
  methods: {
    getMsg() {
      return emoteParser(xss(this.data.item.message), this.data.item)
    }
  }
}
</script>