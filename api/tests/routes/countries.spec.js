/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Country, conn } = require("../../src/db.js");

const agent = session(app);
const country = {
  name: "Argentina",
  id: "ARG",
  flag: "https://restcountries.eu/data/arg.svg",
  capital: "Buenos Aires",
  continent: "South America",
  nameToSerch: "argentina",
};

describe("Country routes", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  beforeEach(() =>
    Country.sync({ force: true }).then(() => Country.create(country))
  );
  describe("GET /Country", () => {
    it("should get 200", () => agent.get("/Country/ARG").expect(200));
  });
  describe("GET /Country", () => {
    it("should get 404", () => agent.get("/Country?name=nopaisnombre").expect(404));
  });
});
