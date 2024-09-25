// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { seedMusician } = require("./seedData");

describe("./musicians endpoint", () => {
  // Write your tests here
  beforeAll(async () => {
    await db.sync();
  });

  afterAll(async () => {
    await db.close();
  });

  test("GET /musicians returns a 200 status", async () => {
    const response = await request(app).get("/musicians");
    expect(response.statusCode).toBe(200);
    // expect(Array.isArray(response.body).toBe(true));
  });

  test('Get single musician by /musicians/:id', async () => {
    const response = await request(app).get('/musicians/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name');
  });
});
