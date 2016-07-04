# smartcrop-lwip

This is an adapter module for using [smartcrop.js](https://github.com/jwagner/smartcrop.js)
with node.js using [lwip](https://github.com/EyalAr/lwip) for image decoding.

## Installation
```
npm install --save smartcrop-lwip
```

## API

## crop(image, options)

**Image:** string (path to file) or buffer

**Options:** options object to be passed to smartcrop

**returns:** A promise for a cropResult

## Example

```javascript
var request = require('request');
var smartcrop = require('smartcrop-lwip');
var lwip = require('lwip');

function applySmartCrop(src, dest, width, height) {
  request(src, {encoding: null}, function process(error, response, body) {
    if (error) return console.error(error);
    smartcrop.crop(body, {width: width, height: height}).then(function(result) {
      var crop = result.topCrop;

      console.log('** Crop:', crop);

      lwip.open(body, 'jpg', function (err, image) {
        if (err) return console.error(err);

        image.batch()
             .crop(crop.x, crop.y, crop.width + crop.x, crop.y + crop.height)
             .resize(width, height)
             .writeFile(dest, function (err) {
                if (err) return console.error(err);
             });
      });
    }).catch(function (err) {
      console.log('** ERROR:', arguments);
    });
  });
}

var src = 'https://raw.githubusercontent.com/jwagner/smartcrop-gm/master/test/flower.jpg';
applySmartCrop(src, 'flower-square.jpg', 128, 128);

```
