<template>
  <div id="gitHubSearch">
    <b-container class="mt-5 mb-5">
      <b-row class="mt-5">
        <b-col>
          <form id="searchForm" @submit.prevent="submitSearch">
            <h3>Search for an organization on GitHub</h3>
            <div class="mt-3">
              <input v-model="search" type="text" />
              <button type="submit">Search</button>
            </div>
          </form>
        </b-col>
      </b-row>

      <!-- Loading -->
      <b-row class="mt-5 text-left" v-if="loading">
        <b-col md="6" offset-md="3">
          <b-col class="mt-5 text-left" sm="12">
            <vcl-list width="500" secondary="#AED1DE"></vcl-list>
          </b-col>
          <b-col class="mt-3 text-left" sm="12">
            <vcl-list width="500" secondary="#AED1DE"></vcl-list>
          </b-col>
        </b-col>
      </b-row>

      <b-row class="mt-5 text-left" v-if="!loading && error">
        <b-col md="6" offset-md="3">
          <h3>
            {{ error }}
          </h3>
        </b-col>
      </b-row>
    </b-container>

    <!-- Organization -->
    <b-container
      class="mt-5 pb-5 text-left"
      v-if="organization && !loading && !error"
    >
      <!-- Info -->
      <b-row id="organizationInfo">
        <b-col md="3" offset-md="2">
          <b-img
            :src="organization.avatarUrl"
            v-bind="largeImageProps"
            rounded="circle"
            class="ml-3"
          ></b-img>
        </b-col>
        <b-col md="6">
          <h3>{{ organization.name }}</h3>
          <div
            v-if="containsInfo(organization.name)"
            v-html="organization.descriptionHTML"
          ></div>
          <div v-else>
            <p>No public info.</p>
          </div>
          <a :href="organization.websiteUrl" target="_blank"
            >Read more about {{ organization.name }}</a
          >
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <!-- Organization repositories -->
          <b-col class="mt-5">
            <h3>Top ten that belongs to {{ organization.name }}</h3>
            <b-list-group>
              <b-list-group-item
                v-for="repo in organizationRepositories"
                :key="repo.name"
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
                <span>
                  <b-badge variant="primary" rigth pill
                    >Starred {{ repo.stargazerCount }}</b-badge
                  >
                  <b-badge variant="primary" right pill
                    >Watched {{ repo.watchers.totalCount }}</b-badge
                  >
                </span>
              </b-list-group-item>
            </b-list-group>
          </b-col>

          <!-- Starred by members of organization -->
          <b-col class="mt-5">
            <h3>Starred by members of {{ organization.name }}</h3>
            <b-list-group>
              <b-list-group-item
                v-for="(repo, index) in memberStarredRepositories"
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
                <span>
                  <b-badge variant="primary" rigth pill
                    >Starred {{ repo.stargazerCount }}</b-badge
                  >
                  <b-badge variant="primary" right pill
                    >Watched {{ repo.watchers.totalCount }}</b-badge
                  >
                </span>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-col>

        <b-col md="6">
          <!-- Belongs to members of organization -->
          <b-col class="mt-5">
            <h3>Belongs to members of {{ organization.name }}</h3>
            <b-list-group>
              <b-list-group-item
                v-for="(repo, index) in memberRepositories"
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
                <span>
                  <b-badge variant="primary" rigth pill
                    >Starred {{ repo.stargazerCount }}</b-badge
                  >
                  <b-badge variant="primary" right pill
                    >Watched {{ repo.watchers.totalCount }}</b-badge
                  >
                </span>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col>
          <h3 class="text-center">That´s it for now</h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { VclList } from "vue-content-loading";
import axios from "axios";
export default {
  name: "GitHubApiSearch",
  components: {
    VclList,
  },
  data() {
    return {
      loading: false,
      error: false,
      search: "",
      organization: null,
      largeImageProps: { width: 150, height: 150 },
      avatarProps: { width: 25, height: 25 },
    };
  },
  methods: {
    async submitSearch() {
      if (!this.search) return;
      this.loading = true;
      const response = await axios.get("/api/related_repositories", {
        params: {
          search: this.search,
        },
      });
      if (response.data.organization) {
        this.loading = false;
        this.error = false;
        this.memberReposLimit = 10;
        this.memberStarredReposLimit = 10;
        this.organization = response.data.organization;
      } else if (response.data.error) {
        this.loading = false;
        this.error = response.data.error;
      } else {
        this.loading = false;
        this.error = "Everything went wrong.";
      }
    },
    containsInfo(htmlText) {
      return htmlText.length > 10;
    },
  },
  computed: {
    organizationRepositories() {
      return this.organization.repositories.nodes.concat().sort((a, b) => {
        return (
          b.watchers.totalCount - a.watchers.totalCount ||
          b.stargazerCount - a.stargazerCount
        );
      });
    },
    memberRepositories() {
      const repositories = this.organization.membersWithRole.members
        .concat()
        .reduce((repos, member) => {
          member.repositories.nodes.filter((repo) => {
            repos.push(repo);
          });
          return repos;
        }, []);
      return repositories.sort((a, b) => {
        return (
          b.watchers.totalCount - a.watchers.totalCount ||
          b.stargazerCount - a.stargazerCount
        );
      });
    },
    memberStarredRepositories() {
      const repositories = this.organization.membersWithRole.members.reduce(
        (repos, member) => {
          member.starredRepositories.nodes.filter((repo) => {
            repos.push(repo);
          });
          return repos;
        },
        []
      );

      return repositories.sort((a, b) => {
        return (
          b.watchers.totalCount - a.watchers.totalCount ||
          b.stargazerCount - a.stargazerCount
        );
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  background-color: rgba(0, 0, 0, 0);
  border: 2px solid #fff;
  padding: 2px 15px;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
}
#gitHubSearch {
  padding-top: 100px;
}
#searchForm input {
  padding: 5px 20px;
  font-size: 22px;
  border-radius: 20px 0 0 20px;
  border: none;
}
#searchForm input:focus {
  outline: none;
}
#searchForm button {
  font-size: 22px;
  padding: 3px 20px;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 0 20px 20px 0;
}
#searchForm button:active {
  background-color: #fff;
  color: #29a6de;
}
#searchForm button:focus {
  outline: none;
}
.list-group-item {
  color: #333;
}
.title h3 {
  position: relative;
  top: 18px;
  left: 10px;
}
#organizationInfo a {
  color: #fff;
  border-bottom: 1px solid #fff;
}
#organizationInfo a:hover {
  background-color: #fff;
  color: #333;
  text-decoration: none;
  padding: 2px;
}
</style>
