const app = require('govuk-prototype-kit/server')
const supertest = require('supertest')

/* 
  renderRoute is a helper function used by the end-to-end tests
  to render a path for comparison with the main served application
*/
const renderRoute = async (filename) => {
  const server = app.listen()
  // NOTE - redirects(1) is required as the prototype toolkit may redirect a page
  // without it the page will render as "Found - redirecting ..."
  const response = await supertest(server).get(filename).redirects(1)
  server.close()
  return response.text
}

module.exports = { renderRoute }
