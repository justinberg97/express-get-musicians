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

  test('Can create single musician', async () => {
    const newMusician = { name: "Justin Berg", instrument: "Guitar"};
    const response = await request(app).post('/musicians').send(newMusician);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: newMusician.name, instrument: newMusician.instrument })])
    );
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
  });

  test("should return an error if name is empty", async () => {
    const response = await request(app).post("/musicians").send({
        name: "",
        instrument: "Guitar",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Name cannot be empty");
});

test("should return an error if instrument is empty", async () => {
    const response = await request(app).post("/musicians").send({
        name: "Justin",
        instrument: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Instrument cannot be empty");

});
test("should return an error if both are empty", async () => {
    const response = await request(app).post("/musicians").send({
        name: "",
        instrument: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors.length).toBe(2);
});

});