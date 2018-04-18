const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const options = {
  uri: "http://www.scifiideas.com/spaceship-generator/"
};

spaceships = []

function getSpaceShip(number){
  return rp(options)
    .then((body) => {
      var spaceShipsRaw = body.split("<div class=\"break_line\"></div><br />"); // Ici on sait qu'on aura 5 (4 en partant de zéro) parties
      
      // On passe dans chaque parties
      for(var i = 0; i < spaceShipsRaw.length; i++) {
        if(i === 0 || i === 4) continue; // On évite la première & dernière partie (inutile)

        var lines = spaceShipsRaw[i].split("</strong>"); // On parse chaque lignes en divisant à </strong>
        
        // Final spaceship formatting
        var name = lines[1].split("<br>");
        name = name[0];
        name = name.replace(" ", "");
        var type = lines[2].split("<br>");
        type = type[0];
        type = type.replace(" ", "");
        var condition = lines[3].split("<br>");
        condition = condition[0];
        condition = condition.replace(" ", "");
        var weapons = lines[4].split("<br>");
        weapons = weapons[0];
        weapons = weapons.replace(" ", "");
        var defence = lines[5].split("<br>");
        defence = defence[0];
        defence = defence.replace(" ", "");
        if(lines[6]) { // Parfois le manufacturer n'est pas défini
          var manufacturer = lines[6].split("<br>");
          manufacturer = manufacturer[0];
          manufacturer = manufacturer.replace(" ", "");
        }
        
        // Assemblage final
        var spaceship = {
          "name": name,
          "type": type,
          "condition": condition,
          "weapons": weapons,
          "defence": defence,
          "manufacturer": manufacturer || "" // Si il n'y a pas de manufacturer alors on affiche rien
        }
        spaceships.push(spaceship); // Et on envoi le vaisseau dans l'array
      }

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
  promises.push(getSpaceShip(i));
}

Promise.all(promises).then(function() {
  spaceshipsJson = JSON.stringify(spaceships);
  //console.log(spaceshipsJson);
  fs.writeFile("spaceships.txt", spaceshipsJson, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("Spaceships was saved!");
  });
 })
.catch(console.error);