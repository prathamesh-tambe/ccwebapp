module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
                "db" : {
                    "host":"localhost",
                    "user":process.env.NODE_DB_USER,
                    "password":process.env.NODE_DB_PASS,
                    "database":"books"    
                },
                "image" : {
                    "imageBucket" : "images/",
                    "imageurl" : ""
                },
                "salt" : {
                    "rounds":10,
                    "pass":"s0/\/\P4$$w0rD",
                    "plainpass":"not_happening"
                }
            };

        case 'prod':
            return {
                "db" : {
                    "host":process.env.NODE_DB_HOST,
                    "user":process.env.NODE_DB_USER,
                    "password":process.env.NODE_DB_PASS,
                    "database":"csye6225"
                },
                "image" : {
                    "imageBucket" : process.env.NODE_S3_BUCKET,
                    "imageurl" : "http://s3.amazonaws.com/"
                },
                "salt" : {
                    "rounds":10,
                    "pass":"s0/\/\P4$$w0rD",
                    "plainpass":"not_happening"
                }
            };

        default:
            return {"error":true};
    }
};