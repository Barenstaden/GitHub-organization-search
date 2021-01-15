const express = require("express");
const app = express();
const g = require("graphql-request");
const { GraphQLClient, gql } = g;

const port = 3001;
const url = "https://api.github.com/graphql";

const TOKEN = "618dff28c26c857c353dc7f38d556fe9d7e18b7a";

const graphQLClient = new GraphQLClient(url, {
  headers: {
    authorization: `Bearer ${TOKEN}`,
  },
});

const query = gql`
  query organization($search: String!) {
    organization(login: $search) {
      name
      avatarUrl
      websiteUrl
      location
      descriptionHTML
      membersWithRole(first: 10) {
        members: nodes {
          ... on User {
            name
            starredRepositories(first: 10) {
              nodes {
                url
                name
                stargazerCount
                watchers(first: 1) {
                  totalCount
                }
                owner {
                  avatarUrl
                }
              }
            }
            repositories(first: 10) {
              nodes {
                url
                name
                stargazerCount
                owner {
                  avatarUrl
                }
                watchers(first: 1) {
                  totalCount
                }
              }
            }
          }
        }
      }
      repositories(first: 10) {
        nodes {
          url
          name
          stargazerCount
          watchers(first: 1) {
            totalCount
          }
          owner {
            avatarUrl
          }
        }
      }
    }
  }
`;

app.get("/related_repositories", async (req, res) => {
  if (!req.query.search) {
    res.send("Missing input");
  } else {
    try {
      const data = await graphQLClient.request(query, {
        search: req.query.search,
      });
      res.json(data);
    } catch (error) {
      res.json({ organization: false });
    }
  }
});

app.listen(port, () => {
  console.log(`GitHub API server running at http://localhost:${port}`);
});
