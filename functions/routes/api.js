const express = require('express');
const router = express.Router();
const apiKey = 'NSKX6d8Sn88fhDt4LasuVvYgLn7I6WaAq1kuPmm3xgM8Cfc-fT8kjaxeEC9LrtnKW5lVoew4yixGKfA6WYniRQ';
const fs = require('fs'),
  cloudconvert = new (require('cloudconvert'))(apiKey);

router.get('/convert', function(req, res){
  res.send("This is working");
});

router.post('/convert', function(req, res) {
  var response = {};
  const inputFormat = req.body.inputformat;
  const inputFileName = req.body.inputfilename;
  const fileUrlRaw = req.body.fileUrl;
  const fileUrl = fileUrlRaw.replace('%252E', '.');
  console.log(inputFormat);
  console.log(fileUrl);
  cloudconvert.convert({
    "inputformat": inputFormat,
    "outputformat": "html",
    "input": "download",
    "file": fileUrl,
    "filename": inputFileName,
    "converteroptions": {
      "outline": null,
      "zoom": "1.5",
      "page_width": 795,
      "page_height": null,
      "embed_css": true,
      "embed_font": true,
      "embed_javascript": true,
      "embed_image": true,
      "page_range": null,
      "split_pages": null,
      "simple_html": null,
      "input_password": null,
      "templating": null
    },
    "output": {
      "googlecloud": {
        "credentials": {
          "type": "service_account",
          "project_id": "hopscotch-4a440",
          "private_key_id": "8b7e5f33d3caea78f18faf465ea7b780d417b781",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9IAgFjecVsnaO\nLPzZgPbHwpmfHEW/cP1OAwY9A1D0GIvPwIColbvqPGOQc/DVkg4ZESv1AXyJ1vpt\nOtJDA4GJpKUKOb0OzOQ2P7BmgkOrUTiblSVWvXx/twXMQLCoPzFzQ+8KZ5HvEF5W\nNLtVuVRYGl7Eg5IbLmV9umAOz+18c4ZTTYDZinXKCDUlDS/l8me9UTg1Iiy/x9zJ\nV1caFLzN/QKpNIJNPir47APhPyfPreGaSdf6FkDi/S3BweUReATnW938PN7bWe71\nKtoq3CcbuosvDq5aRJsnOhZ+FzhB0y986FS/235MbH83GBqf2PEdlJil1Z7GrSZ6\nrmx7tjv1AgMBAAECggEAE7FKJInqDfBPN+6nRV6QU6yHonGnMY/qUD0wYRn/S+ti\nY3d/7g3pSzKOi3QHF7Xlkeaf1RsahJ/F46nESwYKbvKd3Lq2XNwoxx1KmOHneecz\nJcAZ6zY/yGyeRe5Wdq5dz8q7ETJHl8T0jbVf7EUn6ySTyZKJnBrwpm7JocE00Uho\nTjdKEI/AYiTNVRNhskKQW1zdnvYE2g4EI15o9DkX1yTd6FRJBx24bkiWdbxKgmSK\n27Kqi/5OcKDygmSw7BUf/Nq5u0GIL+BHCETSyBnY8snYDAXlAEJ/zor96KmAmCLp\nnqwYPkata61XNloX67ea/b2btA/xKnM+dG7brjF14QKBgQDl6CYWD9bJODCxxUaj\nyXGX3dw90tqm04+UpUFKJ7nv0RvxqmFXdI/ZvhpTDg7KBGRw7N1ooqBYtscRFV1H\nNBScbnm9ION8fhR0h3x/jDsEuFbWhT61fiOMFOyqw8KpK/5WeBnPS0sApPEvM3Bz\n7gzuTpERVvw5vuBLMbvPvQo7RwKBgQDSlvx9ZphT9sltZSahghVFmLvE0clUs2Pd\n2PYTc1QLtBL/F/PUSPjDbJmw40rEe8qX+9jX1S18xUtNd5o2mG9ClUrsHKb8RYty\nTgYshFh3cpc4Mde8mwW+5q4xEWLq3BPOdIk8I0XsTyTFOLoF6e/F/AJGHrGVQnUw\nOvFoVbz04wKBgD9aEBymMq5x8GEcFlINsWKCvSzADIZJ59ezDeGsPr1JpuSZ6Yba\n1MTQcJqQVhzuxuqjKoOpxHuNqh8X/wMe48sTWjJ2fJkSePp/VxwifSTY0vz77ILA\nhnUUUv7fQKWzPLuBDsOjYMCFsvwptYQMhb2pIqpfiNM0uMOfqbwdwFMDAoGBAKr/\nr0akaEzFuAn8eMHsvxkkTFQlhTYh9JXP9wEURMq8DjDVYkieeGE3bhUUe0HQw1Fm\nT03y7FzEV8EvvSlX3gBS+eN/4Jg4YGMQuDKtxKg5hFE9J9EekCvTZN6zH39V9T9P\noaAThFO+cD01MthafThmyfHmOozYyg+/zQbLmAPBAoGAX4v/2zH2y6G2B+EDAeUY\nFZ9Y/lX2cVUehZRP4bjQmYq7RYWD7Z97ijJQOvuajlso9M/b5TFaU4b1hx+3kB5c\nzqHQsJyKDY7F1daC9bKwsIX3yECQinri7sFH7UexfNPpZrMiqp+JfK6bmgmj56fa\n1wT2lfHGtZ6STNgy64JWzOs=\n-----END PRIVATE KEY-----\n",
          "client_email": "hopscotch-4a440@appspot.gserviceaccount.com",
          "client_id": "114433607063506181645",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://accounts.google.com/o/oauth2/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hopscotch-4a440%40appspot.gserviceaccount.com"
        },
        "projectid": "hopscotch-4a440",
        "bucket": "hopscotch-4a440.appspot.com",
        "path": "files/"
      }
    }
  }).on('finished', function(a){
    console.log('Ok HTML: ', a);
    response.html = a.output;
//   res.send(a);
    cloudconvert.convert({
      "inputformat": inputFormat,
      "outputformat": "jpg",
      "input": "download",
      "file": fileUrl,
      "filename": inputFileName,
      "converteroptions": {
        "no_images": null,
        "disable_javascript": null,
        "javascript_delay": 20000,
        "zoom": 1,
        "screen_width": 1024,
        "screen_height": null,
        "resize": "300x300",
        "resizemode": "scale",
        "quality": "94",
        "use_chrome": null,
        "command": null,
        "resizeenlarge": null,
        "grayscale": null,
        "page_range": "1-1"
      },
      "output": {
        "googlecloud": {
          "credentials": {
            "type": "service_account",
            "project_id": "hopscotch-4a440",
            "private_key_id": "8b7e5f33d3caea78f18faf465ea7b780d417b781",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9IAgFjecVsnaO\nLPzZgPbHwpmfHEW/cP1OAwY9A1D0GIvPwIColbvqPGOQc/DVkg4ZESv1AXyJ1vpt\nOtJDA4GJpKUKOb0OzOQ2P7BmgkOrUTiblSVWvXx/twXMQLCoPzFzQ+8KZ5HvEF5W\nNLtVuVRYGl7Eg5IbLmV9umAOz+18c4ZTTYDZinXKCDUlDS/l8me9UTg1Iiy/x9zJ\nV1caFLzN/QKpNIJNPir47APhPyfPreGaSdf6FkDi/S3BweUReATnW938PN7bWe71\nKtoq3CcbuosvDq5aRJsnOhZ+FzhB0y986FS/235MbH83GBqf2PEdlJil1Z7GrSZ6\nrmx7tjv1AgMBAAECggEAE7FKJInqDfBPN+6nRV6QU6yHonGnMY/qUD0wYRn/S+ti\nY3d/7g3pSzKOi3QHF7Xlkeaf1RsahJ/F46nESwYKbvKd3Lq2XNwoxx1KmOHneecz\nJcAZ6zY/yGyeRe5Wdq5dz8q7ETJHl8T0jbVf7EUn6ySTyZKJnBrwpm7JocE00Uho\nTjdKEI/AYiTNVRNhskKQW1zdnvYE2g4EI15o9DkX1yTd6FRJBx24bkiWdbxKgmSK\n27Kqi/5OcKDygmSw7BUf/Nq5u0GIL+BHCETSyBnY8snYDAXlAEJ/zor96KmAmCLp\nnqwYPkata61XNloX67ea/b2btA/xKnM+dG7brjF14QKBgQDl6CYWD9bJODCxxUaj\nyXGX3dw90tqm04+UpUFKJ7nv0RvxqmFXdI/ZvhpTDg7KBGRw7N1ooqBYtscRFV1H\nNBScbnm9ION8fhR0h3x/jDsEuFbWhT61fiOMFOyqw8KpK/5WeBnPS0sApPEvM3Bz\n7gzuTpERVvw5vuBLMbvPvQo7RwKBgQDSlvx9ZphT9sltZSahghVFmLvE0clUs2Pd\n2PYTc1QLtBL/F/PUSPjDbJmw40rEe8qX+9jX1S18xUtNd5o2mG9ClUrsHKb8RYty\nTgYshFh3cpc4Mde8mwW+5q4xEWLq3BPOdIk8I0XsTyTFOLoF6e/F/AJGHrGVQnUw\nOvFoVbz04wKBgD9aEBymMq5x8GEcFlINsWKCvSzADIZJ59ezDeGsPr1JpuSZ6Yba\n1MTQcJqQVhzuxuqjKoOpxHuNqh8X/wMe48sTWjJ2fJkSePp/VxwifSTY0vz77ILA\nhnUUUv7fQKWzPLuBDsOjYMCFsvwptYQMhb2pIqpfiNM0uMOfqbwdwFMDAoGBAKr/\nr0akaEzFuAn8eMHsvxkkTFQlhTYh9JXP9wEURMq8DjDVYkieeGE3bhUUe0HQw1Fm\nT03y7FzEV8EvvSlX3gBS+eN/4Jg4YGMQuDKtxKg5hFE9J9EekCvTZN6zH39V9T9P\noaAThFO+cD01MthafThmyfHmOozYyg+/zQbLmAPBAoGAX4v/2zH2y6G2B+EDAeUY\nFZ9Y/lX2cVUehZRP4bjQmYq7RYWD7Z97ijJQOvuajlso9M/b5TFaU4b1hx+3kB5c\nzqHQsJyKDY7F1daC9bKwsIX3yECQinri7sFH7UexfNPpZrMiqp+JfK6bmgmj56fa\n1wT2lfHGtZ6STNgy64JWzOs=\n-----END PRIVATE KEY-----\n",
            "client_email": "hopscotch-4a440@appspot.gserviceaccount.com",
            "client_id": "114433607063506181645",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://accounts.google.com/o/oauth2/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/hopscotch-4a440%40appspot.gserviceaccount.com"
          },
          "projectid": "hopscotch-4a440",
          "bucket": "hopscotch-4a440.appspot.com",
          "path": "thumbnail/"
        }
      }
    }).on('finished', function(t){
      console.log('Ok Thumbnail: ', t);
      response.thumbnail = t.output;
      res.send(response);
      console.log('Final Response: ', response);
    }).on('error', function(te){
      console.log('Fail: ', te);
      res.send(te);
    });
  }).on('error', function(e){
    console.log('Fail: ', e);
    res.send(e);
  });

});

module.exports = router;
