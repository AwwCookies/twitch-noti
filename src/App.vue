<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Notifications</router-link> |
      <router-link to="/settings">Settings</router-link> |
      <router-link to="/channelsettings">Channel Settings</router-link> |
      <router-link to="/backup">Backup</router-link>
    </div>
    <router-view/>
    <hr/>
    <footer>Version 1.5 | twitter.com/AwwEmma</footer>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$router.push({path: '/'})
  }
}
</script>

<style>
body {
  background-color: #19171C;
  color: white;
  font-family: "Inter", "Roobert", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
input {
  background-color: #464649;
}
input :focus {
  background-color: #080808;
}
#app {
  text-align: center;
  /* width: 600px; */
  /* max-height: 400px; */
  padding: 10px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #0E9DD9;
}

#nav a.router-link-exact-active {
  color: #6441A5;
}
</style>
