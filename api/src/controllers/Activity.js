const { Activity, Country, CountryActivity } = require("../db");
const { URL } = require("../Variables");
const axios = require("axios");

const newActivity = async (req, res, next) => {
  if (!req.body) res.send("Reacer el formulario");
  const { name, difficulty, duration, season, about, countryId } = req.body;
  try {
    let result = {};
    if (!(await Activity.findOne({ where: { name: name } }))) {
      result = await Activity.create({
        name,
        difficulty,
        duration,
        season,
        about,
      });
    } else {
      const update = await Activity.destroy({
        where: { name: name },
      });
      if (update) {
        result = await Activity.create({
          name,
          difficulty,
          duration,
          season,
          about,
        });
      }
    }
    if (result) {
      countryId.forEach((e) => result.addCountries(e));
      res.status(200).json(result);
    } else res.sendStatus(500);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  newActivity,
};
