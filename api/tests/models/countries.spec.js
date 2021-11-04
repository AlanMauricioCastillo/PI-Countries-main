const { Country, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Countries model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Country.sync({ force: true }));
    describe("name", () => {
      it("should throw an error if name is null", (done) => {
        Country.create({})
          .then(() => done(new Error("It requires a valid name")))
          .catch(() => done());
      });
      it("should work when its a valid name", () => {
        Country.create({ name: "Pikachu" }).then(() =>
          expect(Country.name).to.equal("Pikachu")
        );
      });
      describe("validate an error ", () => {
        it("should throw an error if name is null", function (done) {
          Country.create({
            name: null,
          })
            .then(() => done("No deberia haberse creado"))
            .catch(() => done());
        });
      });
    });
  });
});
