<template>
  <span>
    <b-badge variant="primary" rigth pill
      ><b-icon-star></b-icon-star> {{ starred }}</b-badge
    >
    <b-badge variant="primary" right pill
      ><b-icon-eye></b-icon-eye> {{ watchers }}</b-badge
    >
  </span>
</template>

<script>
export default {
  props: {
    starred: Number,
    watchers: Number,
  },
};
</script>

<style></style>
