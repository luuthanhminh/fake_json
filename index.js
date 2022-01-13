
const {Chance} = require('chance')
const {resolve, extend} = require('json-schema-faker');
const fs = require('fs');
extend('faker', () => require('@faker-js/faker'));
extend('chance', () => new Chance());
const schema = {
  type: "object",
  required: ["gtingroups"],
  properties: {
    gtingroups: {
      type: "array",
      minItems: 20,
      items: { "$ref": "#/definitions/gtingroups" }
    }
  },
  definitions: {
    gtingroups: {
      type: "object",
      required: [ "id", "status", "consumptionTheme", "title"],
      properties: {
        id: {
          type: "string",
          faker: "datatype.uuid"
        },
        status: {
          type: "string",
          faker: "name.firstName"
        },
        consumptionTheme: {
          type: "string",
          chance: {
            "pickone": [
              [
                "banana",
                "apple",
                "orange"
              ]
            ]
          }
        },
        title: {
          type: "integer",
          maximum: 70,
          minimum: 18
        }
      }
    }
  }
}
resolve(schema).then(sample => {
  console.log('Writing to db.json')
  fs.writeFile(`${__dirname}/db.json`, JSON.stringify(sample), function(err) {
    if(err) {
      console.error(err);
    } else {
      console.log("done");
    }
  });
});
