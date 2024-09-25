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

  test('Can create single musician by /musicians/:id', async () => {
    const newMusician = { name: "Justin Berg", instrument: "Guitar"};
    const response = await request(app).post('/musicians').send(newMusician);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(newMusician.name);
  });
  
  test('Can update single musician by /musicians/:id', async () => {
    const updatedMusician = { name: "Justin Berg", instrument: "Guitar"};
    const response = await request(app).put('/musicians/1').send(updatedMusician);
    expect(response.statusCode).toBe(200);
    const musician = await Musician.findByPk(1);
    expect(musician.name).toBe(updatedMusician.name);
  });

  test("Can delete musician by /musicians/:id" , async () => {
    const response = await request(app).delete("/musicians/1");
    expect(response.statusCode).toBe(200);
    const deletedMusician = await Musician.findByPk(1);
    expect(deletedMusician).toBeNull();
  })
});
