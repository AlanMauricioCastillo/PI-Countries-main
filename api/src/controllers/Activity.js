const { Activity, Country, CountryActivity } = require("../db");
const { URL } = require("../Variables");
const axios = require("axios");

const newActivity = async (req, res, next) => {
  if (!req.body) res.send("Reacer el formulario");
  const { name, difficulty, duration, season, about, countryId } = req.body;
  try {
    //let result = {};
   /*  let arr = []
    const activity = await Activity.findOne({
      where: { name: name.toLowerCase() },
      include: { model: Country },
    });
    countryId.map((id) => {
      arr.push(Country.findByPk(id, {
        include: { model: Activity },
      }));
    })
    const countries = await Promise.all(arr);
console.log(arr)
    console.log(countries.CountryActivity,'countries');
    console.log(countries.Countries,'countries');
    console.log(activity,'activity'); */

    /* if (activity && activity.length < 1) {
      result = await Activity.create({
        name,
        difficulty,
        duration,
        season,
        about,
      });
    } else {
      console.log("Actividad ya existe");
      const update = await Activity.destroy({
        where: { 
          name: name.toLowerCase(),
        },
      }); 
    } */


   /*  if (!(await Activity.findOne({ 
      where: { 
        name: name.toLowerCase(),

      } 
    }))) {
      result = await Activity.create({
        name,
        difficulty,
        duration,
        season,
        about,
      });
    } else {
      const update = await Activity.destroy({
        where: { 
          name: name.toLowerCase(),
        },
      });
      if (update) { */
      let result = await Activity.create({
          name,
          difficulty,
          duration,
          season,
          about,
        });
      //}
    //}
    if (result) {
      countryId.forEach((e) => result.addCountries(e));
      let Lastresult = {
        id: result.id,
        name: result.name,
        difficulty: result.difficulty,
        duration: result.duration,
        season: result.season,
        about: result.about,
        countryId: countryId,
      } 
      res.status(200).json(Lastresult);
    } else res.sendStatus(500);
  } catch (err) {
    next(err);
  }
};


const getActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findAll({
      include: { model: Country },
    });
    res.status(200).json(activity);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  newActivity,
  getActivity,
};
