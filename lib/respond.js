//Require nodeJS modules
const url = require('url');
const path = require('path');
const fs = require('fs');

//File imports
const buildBreadcrumb = require('./breadcrumb.js');
const buildMainContent = require('./mainContent.js');
const getMimeType = require('./getMimeType.js');

//Static base path
console.log('StaticBasePath: ' + path.join(__dirname, '..', 'static'));
const staticBasePath = path.join(__dirname, '..', 'static');

//respond to a request
//Following is the function passed to createServer.
const respond = (request, response) => {
    console.log('Respond  fired! (app)');
    //response.write('Response fired in html!');
    //response.end();

    //Decoding the pathname
    let pathname = url.parse(request.url, true).pathname;
    if(pathname === '/favicon.ico'){
        return false;
    }
    console.log(pathname);
    //console.log(decodeURIComponent(pathname));
    pathname = decodeURIComponent(pathname);

    //Get the corresponding full static path located in the static folder 
    //console.log(path.join(staticBasePath, pathname));
    const fullStaticPath = path.join(staticBasePath, pathname);

    if(!fs.existsSync(fullStaticPath)){
        console.log(`${fullStaticPath} does not exist!`);
        response.write(`${fullStaticPath} 404: File not found!`);
        //response.end();
        return false;
    }
    else{
        console.log(`Path: ${fullStaticPath}`);
        //response.write(`Path: ${fullStaticPath}`);
        //response.end();
    }
    
    //Verify if it's a file or a directory
    let stats; 
    try{
        console.log(`fullStaticPath: ${fs.lstatSync(fullStaticPath)}`);
        stats = fs.lstatSync(fullStaticPath);
    }catch(err){
        console.log(`lstatSync: ${err}`);
    }

    //It's a directory
    console.log(`Directory: ${stats.isDirectory()}`);
    if(stats.isDirectory()){
        //Get the index template
        let data = fs.readFileSync(path.join(staticBasePath, 'project_files/index.html'), 'utf-8');
        //console.log(`DATA: ${data}`);

        //Build page title
        //console.log(`pathName: ${pathname}`);
        let pathElements = pathname.split('/').reverse();
        pathElements = pathElements.filter(element => element !== '');

        //Page title
        let folderName = pathElements[0];        
        if(folderName === undefined){
            folderName = 'Home';
        }
        console.log(`folderName: ${folderName}`);        

        //Breadcrumb
        //Read breadcrumb.js file
        const breadcrumb = buildBreadcrumb(pathname);

        //Build the table rows
        const mainContent = buildMainContent(fullStaticPath, pathname);
        
        //Replacing static components to the right content
        data = data.replace('Page_title', folderName);
        data = data.replace('pathname', breadcrumb);
        data = data.replace('mainContent', mainContent);

        //Printing the webpage
        response.statusCode = 200;
        response.write(data); // index.html
        return response.end();
    }

    if(!stats.isFile()){
        response.statusCode = 401;
        response.write('401: Access denied!');
        console.log('Is not a file!');
        return response.end();
    }

    //Get the extension of the file
    let fileDetails = {};
    fileDetails.extname = path.extname(fullStaticPath);
    //console.log(`Extension: ${fileDetails.extname} \nPath: ${path}`);

    //File size
    let stat;
    try{
        stat = fs.statSync(fullStaticPath);

    }catch(err){
        console.log(`Stat error: ${err}`);
    }

    fileDetails.size = stat.size;

    //Get the file mime type
    getMimeType(fileDetails.extname) 
        .then(mime => {
            //console.log(`mime: ${mime}`);
            //Store headers
            let head = {}; 
            let options = {};
            //Response status code 
            let statusCode = 200;
            //Set "Content type for all file types"
            head['Content-Type'] = mime;
            //console.log(`Content-type: ${head}`);
            
            //Reading the file using fs.readFile
            /*
            fs.promises.readFile(fullStaticPath, 'utf-8')
                .then(data => {
                    response.writeHead(statusCode, head);
                    response.write(data);

                    return response.end();
                })
                .catch(error => {
                    response.statusCode = 404;
                    response.write('404: File reading error!');
                    console.log(`Promise error: ${error}`);
                    return response.end();
                });
            */

            //Audio or video files
            if(RegExp('audio').test(mime) || RegExp('video').test(mime)){
                //Header
                head['Accept-Ranges'] = 'bytes';
                const range = request.headers.range;
                //console.log(`Range: ${range}`);

                if(range){
                    const start_end = range.replace(/bytes=/, "").split('-');
                    const start = parseInt(start_end[0]);
                    const end = start_end[1]?parseInt(start_end[1]):fileDetails.size - 1;                    

                    head['Content-Range'] = `bytes ${start}-${end}/${fileDetails.size}`;
                    head['Content-Length'] = (end - start) + 1;
                    statusCode = 206;

                    //console.log(`Start_end0: ${start_end[0]} \nStart_end1: ${start_end[1]} \nStart_end2: ${start_end[2]}`);
                    //console.log(`Start: ${start} \nEnd: ${end}\nFileSize: ${fileDetails.size}`);

                    //options
                    options = {start, end};
                }
                
            }

            //Streaming method
            const fileStream = fs.createReadStream(fullStaticPath, options);
            //Stream chunks to my response object
            response.writeHead(statusCode, head); 
            fileStream.pipe(response);

            //Events: close and error
            fileStream.on('close', () => {
                return response.end();
            });

            fileStream.on('error', error => {
                console.log(error.code);
                response.statusCode = 404;
                response.write('404: Internal server error!');
                return response.end();
            });

        })
        .catch(err => {
            response.statusCode = 500;
            response.write('500: Internal server error!');
            console.log(`Promise error: ${err}`);
            return response.end();
        }); 
       

} 

module.exports = respond;