// Pull default from ~/.aws/config 
process.env.AWS_SDK_LOAD_CONFIG = true;
var AWS = require('aws-sdk');
var apigateway = new AWS.APIGateway();
var s3 = new AWS.S3();
var res = [];
var params = {limit: 500};

apigateway.getRestApis(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else  var items = data.items;

  var params = {
    Bucket: 'hopefully-this-works', 
    Key: 'index.html'
   };
   s3.getObject(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     
     var html = data.Body.toString('utf-8');

     var start = html.search( "\\urls")
     start = start + 7;

     var end = html.search( "\\}],");
     end = end + 1;
    
     variable = html.substr(start, end-start);
     res = variable.split(" , ");


  items.forEach(function(element) {

  var push = '{url: "./' + element.id + '-swagger.yaml", name: "' + element.id + '"}'

  res.indexOf(push) === -1 ? res.push(push) : console.log("This item already exists");

  var params = {
    exportType: 'swagger',
    restApiId: element.id,
    stageName: 'prod',
    accepts: 'application/yaml',
    parameters: {extensions:'apigateway'}
  };
  apigateway.getExport(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('');           // successful response

    const s3params = {
      Bucket: 'hopefully-this-works',
      Key: element.id + '-swagger.yaml',
      Body: data.body,
      ContentType : 'application/yaml'
    };
    s3.upload(s3params, function(err, data) {
      console.log(err);
      });
    });
  });

  html = html.replace(variable, res.join(' , '));

  const s3params = {
    Bucket: 'hopefully-this-works',
    Key: 'index.html',
    Body: html,
    ContentType : 'text/html'
  };
  s3.upload(s3params, function(err, data) {
    console.log(err);
    });

     });
});