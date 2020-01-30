const users_router = require("../../endpoints/routers/users")
const users_model = require("../../endpoints/models/users")
const validate = require("../../endpoints/middleware/validate")
// This test does not care about middleware.
// Anytime we call a middleware function, just call next()
jest.mock("../../endpoints/middleware/validate", () => {
  return {
    user: (req, res, next) => next(),
    token: (req, res, next) => {
      req.user = { id: 1 }
      next()
    },
    admin: (req, res, next) => next(),
    recipe: (req, res, next) => {
      res.locals.recipe = req.body
      next()
    },
    user_recipe: (req, res, next) => next()
  }
})

// Set up our test server
const request = require("supertest")
const express = require("express")
const server = express()
server.use(express.json())
server.use(users_router)

describe("POST /users/register", () => {
  test("Returns status 200 if successful", async () => {
    const user = {
      username: "Brian",
      password: "briantest"
    }

    users_model.add_one = jest.fn(
      () =>
        new Promise(res => {
          setTimeout(() => res(1), 0)
        })
    )

    users_model.get_by_id = jest.fn(req_id => {
      new Promise(res => {
        setTimeout(() => res({ ...user, id: req_id.id, test: true }))
      })
    })
    const expected_user = {
      ...user,
      id: 1,
      test: true
    }

    const response = await request(server)
      .post("/users/register")
      .send(user)
      .set("Accept", "application/json")

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expected_user)
    expect(users_model.add_one).toHaveBeenCalledTimes(1)
    users_model.add_one.mockReset()
  })

  test("Responds with a status of 500 if register fails", async () => {
    users_model.add_one = jest.fn(() => {
      throw { message: "error" }
    })

    const expected_error = { message: "error" }
    const user = {
      username: "Brian",
      password: "briantest"
    }

    const response = await request(server)
      .post("/users/register")
      .send(user)
      .set("Accept", "application/json")

    expect(response.status).toEqual(500)
    expect(response.body).toEqual(expected_error)
    expect(users_model.add_one).toHaveBeenCalledTimes(1)
    users_model.add_one.mockReset()
  })
  test("Responds with a status of 400 if username already", async () => {
    users_model.add_one = jest.fn(() => null)

    const expected_error = /already exists/i
    const user = {
      username: "Brian",
      password: "briantest"
    }

    const response = await request(server)
      .post("/users/register")
      .send(user)
      .set("Accept", "application/json")

    expect(response.status).toEqual(400)
    expect(response.body).toEqual(expected_error)
    expect(users_model.add_one).toHaveBeenCalledTimes(1)
    users_model.add_one.mockReset()
  })
})
