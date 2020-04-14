//Require nodeJS modules
const https = require('https');

const mimeUrl = 'https://gist.githubusercontent.com/AshHeskes/6038140/raw/27c8b1e28ce4c3aff0c0d8d3d7dbcb099a22c889/file-extension-to-mime-types.json';

const getMimeType = extension => {
    return new Promise((resolve, reject) => {
        https.get(mimeUrl, (response) => {
            //console.log(`statusCode: ${response.statusCode}`);
            if(response.statusCode < 200 || response.statusCode > 299){
                reject(`Failed to load mime types Json file: ${response.statusCode}`);
                console.log(`Failed to load mime types Json file: ${response.statusCode}`);

                return false;
            }

            let data ='';

            //Receive data by chunks
            response.on('data', chunk => {
                data += chunk;                
            });

            response.on('end', () => {
                resolve(JSON.parse(data)[extension]);
            });


        }).on('error', (e) => {
            console.error(e);
        })
    });

}

module.exports = getMimeType;