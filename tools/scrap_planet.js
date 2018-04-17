const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const options = {
  uri: `http://www.scifiideas.com/planet-generator/`,
  transform: function (body) {
    return cheerio.load(body);
  }
};


planets = []


function getPlanet(number){
  return rp(options)
    .then(($) => {
      //console.log($);
      //console.log('post-content :');

      //console.log(planetInfo);
      /*
      Planet Name: Sondara


      Location: Chaden System


      Description: A large gas giant with an atmosphere mostly composed of oxygen. It has only one large moon, which has only a very thin atmosphere. A spaceport orbits the gas giant, while the moon is used as a garbage dump.

      */
      planetInfo = $('.post-content').find('p').slice(1).text();
      // Extract info
      strToFind = 'Planet Name: ';
      nd = planetInfo.indexOf(strToFind);
      ne = nd + strToFind.length;
      nend = planetInfo.indexOf('\n', ne);
      //console.log(ne + ' fin=' + nend);
      planetName = planetInfo.slice(ne, nend);
      console.log(number + ' - ' + planetName);
      //console.log(planetName);

      strToFind = 'Description: ';
      nd = planetInfo.indexOf(strToFind, nend);
      ne = nd + strToFind.length;
      fin = planetInfo.indexOf('Like this?', ne);
      //console.log(ne + ' fin=' + fin);
      planetDescription = planetInfo.substr(ne, fin);
      //console.log('planetDescription=' + planetDescription+' -');
      lastDot = planetDescription.slice(0, 256).lastIndexOf('.');
      planetDescription = planetDescription.substr(0, lastDot + 1)
      //console.log('planetDescription=' + planetDescription+' -');

      var planet = {
        name: planetName,
        description: planetDescription
      };
      planets.push(planet);

    })
    .catch((err) => {
      console.log(err);
    });
}
/*
var promises = [1,2,3,4].map(
  function(num){ return getPlanet(); }
);*/
var promises = []
for (let i = 0; i < 100; i++) {
  promises.push(getPlanet(i));
}

Promise.all(promises).then(function() {
  planetsJson = JSON.stringify(planets);
  //console.log(planetsJson);
  fs.writeFile("planets.txt", planetsJson, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Planets was saved!");
  });
 })
.catch(console.error);
