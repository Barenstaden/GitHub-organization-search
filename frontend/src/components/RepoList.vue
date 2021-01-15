<template>
  <b-list-group>
    <b-list-group-item
      v-for="(repo, index) in repos"
      :key="index"
      class="d-flex justify-content-between align-items-center"
    >
      <a :href="repo.url" target="_blank"
        >{{ repo.name }}
        <b-img
          :src="repo.owner.avatarUrl"
          rounded="circle"
          v-bind="avatarProps"
          :alt="repo.owner.name"
        ></b-img
      ></a>
      <CountBadges
        :watchers="repo.watchers.totalCount"
        :starred="repo.stargazerCount"
      />
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import CountBadges from "@/components/CountBadges.vue";
export default {
  components: {
    CountBadges,
  },
  props: {
    repos: Array,
  },
  data() {
    return {
      avatarProps: { width: 25, height: 25 },
    };
  },
};
</script>

<style></style>
