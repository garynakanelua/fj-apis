var http = require('http');

var Twit = require('twit'),
  config = require('./config.js');

  var testArr = [];

/*
 * Get links from some set of twitter users
 */
var T = new Twit({
    consumer_key:  config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token: config.twitter.accessToken,
    access_token_secret: config.twitter.accessTokenSecret
})

/*
 * Search on Twitter.
 *
 * @param  {string} query - search query
 * @param  {string} type - the type of results: mixed, recent, popular
 * @param {function} cb - callback to print out URLS.
 *
 * https://dev.twitter.com/rest/reference/get/search/tweets
 */
var searchTweets = function(query, type, cb){
  
  T.get('search/tweets', { q: query, count: 20, result_type: type}, function(err, reply) {
    reply.statuses.forEach(function(d){
      if(d.entities.urls.length >0){
        var urls = d.entities.urls;
        urls.forEach(function(url){
          cb(url.expanded_url);
          testArr.push("<a class=' col-md-4 embedly-card' href=" + url.expanded_url + ">" + url.expanded_url +  "</>");
        });
      }
    });
  });
console.log(testArr);
return cb;

}

exports.searchTweets = searchTweets;

/** run this **/
searchTweets("#funny", 'popular', console.log);


// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("<html><head>\
  <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css'>\
  <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'></script>\
    <script>\
  (function(w, d){\
   var id='embedly-platform', n = 'script';\
   if (!d.getElementById(id)){\
     w.embedly = w.embedly || function() {(w.embedly.q = w.embedly.q || []).push(arguments);};\
     var e = d.createElement(n); e.id = id; e.async=1;\
     e.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://cdn.embedly.com/widgets/platform.js';\
     var s = d.getElementsByTagName(n)[0];\
     s.parentNode.insertBefore(e, s);\
   }\
  })(window, document);\
</script>\
    <head><style>body{font-family: sans-serif;}a{display:block;}</style></head><body><h1>Feeds</h1></br>" + testArr + "</body></html>");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);
