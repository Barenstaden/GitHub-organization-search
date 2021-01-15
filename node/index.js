const express = require("express");
const app = express();
const g = require("graphql-request");
const { GraphQLClient, gql } = g;
require("dotenv").config();
const port = 3001;
const url = "https://api.github.com/graphql";

const TOKEN = process.env.TOKEN;

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
    res.send({ error: "Missing input" });
  } else if (!TOKEN) {
    res.send({
      error:
        'Token not set. Create a .env file in the node folder and set TOKEN=""',
    });
  } else {
    try {
      const data = await graphQLClient.request(query, {
        search: req.query.search,
      });
      res.json(data);
    } catch (error) {
      console.log(error);
      res.json({
        error: `I´ve talked to GitHub and they wanted me to inform you that "${req.query.search}" is an organization they dont want to be associated with.`,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`GitHub API server running at http://localhost:${port}`);
});
