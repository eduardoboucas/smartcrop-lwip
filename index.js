var smartcrop = require('smartcrop');
var lwip = require('lwip');

function convertBuffer(width, height, buffer) {
  var bufferLength = buffer.length;
  var numPixels = bufferLength / 4;
  var output = new Buffer(bufferLength);

  for (var i = 0; i < numPixels; i++) {
    output[i * 4] = buffer[i];
    output[(i * 4) + 1] = buffer[i + numPixels];
    output[(i * 4) + 2] = buffer[i + (2 * numPixels)];
    output[(i * 4) + 3] = 255;
  }

  return output;
}

var iop = {
  open: function(src, options) {
    return new Promise(function(resolve, reject) {
      lwip.open(src, 'jpg', function (err, image) {
        if (err) return reject(err);

        resolve({
          width: image.width(),
          height: image.height(),
          _lwip: image
        });
      });
    });
  },

  resample: function(image, width, height) {
    return Promise.resolve({
      width: ~~width,
      height: ~~height,
      _lwip: image._lwip,
    });
  },

  getData: function(image) {
    return new Promise(function(resolve, reject) {
      image._lwip.resize(image.width, image.height, function (err, resizedImage) {
        if (err) return reject(err);

        var buffer = convertBuffer(image.width, image.height, resizedImage.__lwip.buffer());

        resolve(new smartcrop.ImgData(image.width, image.height, buffer));
      });
    });
  },
};

exports.crop = function(img, options, callback) {
  options = options || {};
  options.imageOperations = iop;
  return smartcrop.crop(img, options, callback);
};
