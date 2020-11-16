const path = require(`path`);
const slash = require(`slash`);
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  // we use the provided allContentfulBlogPost query to fetch the data from Contentful
  return graphql(
    `
      {
        allContentfulBlogPost {
          edges {
            node {
              id
              slugs
            }
          }
        }
      }
    `
  ).then(result => {
      if (result.errors) {
        console.log("Error retrieving contentful data",      result.errors);
      }
      // Resolve the paths to our template
      const blogPostTemplate = path.resolve("./src/templates/blogpost.js");
      // Then for each result we create a page.
      result.data.allContentfulBlogPost.edges.forEach(edge => {
        createPage({
          path: `/blogpost/${edge.node.slugs}/`,
          component: slash(blogPostTemplate),
          context: {
	    slugs: edge.node.slugs,
            id: edge.node.id
          }
        });
      });
    })
    .catch(error => {
      console.log("Error retrieving contentful data", error);
    });
};