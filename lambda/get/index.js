'use strict';

var AWS = require('aws-sdk'),
	documentClient = new AWS.DynamoDB.DocumentClient(); 

exports.handler = function(event, context, callback){
	var params = {
		TableName : process.env.TABLE_NAME
	};
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{

			var response = {
				"statusCode": 200,
				"headers": {
					"my_header": "my_value"
				},
				"body": JSON.stringify(data.Items),
				"isBase64Encoded": false
			};

		    callback(null, response);
		}
	});
}