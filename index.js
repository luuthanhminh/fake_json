
const {Chance} = require('chance')
const {resolve, extend, format, random, define} = require('json-schema-faker');
const fs = require('fs');
extend('faker', () => require('@faker-js/faker'));
extend('chance', () => new Chance());
format('gtin', () => random.randexp('[1-9]{13}\\d?'));
define('autoIncrement', (value, schema) => {
  if(this.offset === 4) this.offset = 1;
  if (!this.offset) {
    this.offset = value.initialOffset || schema.initialOffset || 1;
  }

  if (value === true) {
    return this.offset++;
  }

  return schema;
});

const schema = {
  type: "object",
  required: ["gtingroups"],
  properties: {
    pendingGtingroups: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: { "$ref": "#/definitions/gtingroups" }
    },
    rejectedGtingroups: {
      type: "array",
      minItems: 5,
      maxItems: 10,
      items: { "$ref": "#/definitions/gtingroups" }
    },
    revisionReasons: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { "$ref": "#/definitions/revisionReason" }
    }
  },
  definitions: {
    revisionReason: {
      type: "object",
      required: [ "id", "reason"],
      properties: {
        id: {
          type: "string",
          faker: "datatype.uuid"
        },
        reason: {
          type: "string",
          chance: {
            "pickone": [
              [
                "bad quality",
                "mistake by autoRetouch",
                "Background is cropped wrong",
              ]
            ]
          }
        }
      }
    },
    gtingroups: {
      type: "object",
      required: [ "id", "gtins", "title", "manufacturerColor","previewImageSource", "numberOfAssets", "status", "classification", "brand", "channel", "assets"],
      properties: {
        id: {
          type: "string",
          faker: "datatype.uuid"
        },
        gtins: {
          type: "array",
          minItems: 2,
          items: { 
            type: "string",
            format: "gtin"
           }
        },
        title: {
          type: "string",
          faker: "commerce.productName"
        },
        manufacturerColor: {
          type: "string",
          faker: "commerce.color"
        },
        previewImageSource: {
          type: "string",
          faker: "image.fashion"
        },
        numberOfAssets: {
          $ref: '#/definitions/positiveInt'
        },
        status: {
          type: "string",
          chance: {
            "pickone": [
              [
                "WaitingForReview",
                "HAKA Rejected CASUAL"
              ]
            ]
          }
        },
        classification: {
          type: "string",
          chance: {
            "pickone": [
              [
                "toysAndGames|toys|playFigures"
              ]
            ]
          }
        }, 
        brand: {
          type: "string",
          chance: {
            "pickone": [
              [
                "DENIM",
                "HAKA MODERN CASUAL",
                "SPORTGERAETE",
                "ACCESSOIRES"
              ]
            ]
          }
        },
        channel: {
          type: "string",
          faker: "commerce.productAdjective"
        },
        assets: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: { "$ref": "#/definitions/asset" }
        }
      }
    },
    positiveInt: {
      type: 'integer',
      minimum: 4,
      maximum : 4
    },
    asset: {
      type: "object",
      required: [ "id", "revisionReason", "status", "resolutionInPx", "subject", "perspective", "mediaId", "imageUrl"],
      properties: {
        id: {
          type: "string",
          faker: "datatype.uuid"
        },
        revisionReason: {
          type: "string",
          chance: {
            "pickone": [
              [
                "bad quality",
                "mistake by autoRetouch",
                "Background is cropped wrong",
              ]
            ]
          }
        },
        status: {
          type: "string",
          chance: {
            "pickone": [
              [
                "WaitingForReview"
              ]
            ]
          }
        },
        resolutionInPx: {
          type: "string",
          chance: {
            "pickone": [
              [
                "2000x200",
                "1600x1600",
              ]
            ]
          }
        },
        subject: {
          type: "string",
          chance: {
            "pickone": [
              [
                "FullBody",
                "WithHeadHumanModel",
                "NoHeadHumanModel"
              ]
            ]
          }
        },
        perspective: {
          type: "string",
          chance: {
            "pickone": [
              [
                "Back",
                "BackAngle",
                "Front",
                "FrontLeft"
              ]
            ]
          }
        },
        mediaId: {
          type: 'string',
          initialOffset: 1,
          autoIncrement: true,
          minimum: 1,
          maximum: 4
        },
        imageUrl: {
          type: "string",
          faker: "image.fashion"
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
