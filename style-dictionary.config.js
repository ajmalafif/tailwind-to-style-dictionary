const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config.js");
const _ = require("lodash");
const { transform } = require("@divriots/style-dictionary-to-figma");
// const StyleDictionary = require("style-dictionary");

// StyleDictionary.registerFormat({
//   name: "figmaTokensPlugin",
//   formatter: ({ dictionary }) => {
//     const transformedTokens = transform(dictionary.tokens);
//     return JSON.stringify(transformedTokens, null, 2);
//   },
// });

// Grab just the theme data from the Tailwind config.
const { theme } = resolveConfig(tailwindConfig);

// Create an empty object to hold our transformed tokens data.
const tokens = {};

// A helper function that uses Lodash's setWidth method to
// insert things into an object at the right point in the
// structure, and to create the right structure for us
// if it doesn't already exist.
const addToTokensObject = function (position, value, attr = null) {
  _.setWith(tokens, position, { value: value, ...attr }, Object);
};

// Loop over the theme data…
_.forEach(theme, function (value, key) {
  switch (key) {
    case "fontFamily":
      // Font family data is in an array, so we use join to
      // turn the font families into a single string.
      _.forEach(theme["fontFamily"], function (value, key) {
        addToTokensObject(
          ["fontFamily", key],
          theme["fontFamily"][key].join(",")
        );
      });
      break;

    case "fontSize":
      // Font size data contains both the font size (makes
      // sense!) but also a recommended line-length, so we
      // create two tokens for every font size, one for the
      // font-size value and one for the line-height.
      _.forEach(theme["fontSize"], function (value, key) {
        addToTokensObject(["fontSize", key], value[0]);
        addToTokensObject(
          ["fontSize", `${key}--lineHeight`],
          value[1]["lineHeight"]
        );
      });
      break;

    case "lineHeight":
      _.forEach(theme["lineHeight"], function (value, key) {
        // convert rem to px
        const valuePx = parseFloat(value) * 16;
        addToTokensObject(["lineHeights", key], valuePx, {
          type: "lineHeights",
        });
      });
      break;

    default:
      _.forEach(value, function (value, secondLevelKey) {
        if (!_.isObject(value)) {
          // For non-objects (simple key/value pairs) we can
          // add them straight into our tokens object.
          addToTokensObject([key, secondLevelKey], value);
        } else {
          // Skip 'raw' CSS media queries.
          if (!_.isUndefined(value["raw"])) {
            return;
          }

          // For objects (like color shades) we need to do a
          // final forOwn loop to make sure we add everything
          // in the right format.
          _.forEach(value, function (value, thirdLevelKey) {
            addToTokensObject([key, secondLevelKey, thirdLevelKey], value);
          });
        }
      });
      break;
  }
});

const limitedFilter = (token) =>
  ["colors", "spacing", "fontFamily"].includes(token.attributes.category);

const fullFilter = (token) =>
  [
    "screens",
    "colors",
    "spacing",
    "opacity",
    "borderRadius",
    "borderWidth",
    "boxShadow",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "letterSpacing",
    "lineHeights",
    "maxWidth",
    "zIndex",
    "scale",
    "transitionProperty",
    "transitionTimingFunction",
    "transitionDuration",
    "transitionDelay",
    "animation",
  ].includes(token.attributes.category);

module.exports = {
  tokens,
  source: ["**/*.tokens.json"],
  format: {
    figmaTokensPlugin: ({ dictionary }) => {
      const transformedTokens = transform(dictionary.tokens);
      return JSON.stringify(transformedTokens, null, 2);
    },
  },
  platforms: {
    json: {
      transformGroup: "js",
      buildPath: "tokens/",
      files: [
        {
          format: "figmaTokensPlugin",
          destination: "tokens.json",
          filter: fullFilter,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "dist/js/",
      files: [
        {
          format: "javascript/module",
          destination: "tokens.js",
          filter: fullFilter,
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    css: {
      transformGroup: "css",
      buildPath: "dist/css/",
      files: [
        {
          format: "css/variables",
          destination: "variables.css",
          filter: fullFilter,
        },
      ],
    },
    scss: {
      transformGroup: "scss",
      buildPath: "src/scss/",
      files: [
        {
          destination: "_variables.scss",
          format: "scss/variables",
          filter: limitedFilter,
        },
      ],
    },
  },
};
