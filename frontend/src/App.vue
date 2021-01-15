<template>
  <div id="app">
    <GitHubApiSearch />
  </div>
</template>

<script>
import GitHubApiSearch from "./components/GitHubApiSearch.vue";

export default {
  name: "App",
  components: {
    GitHubApiSearch,
  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
#app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  background-color: #0093e9;
  background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
}
</style>
