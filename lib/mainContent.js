//Required Node modules
const fs = require('fs');
const path = require('path');

//Files imports
const calculateSizeD = require('./calculateSizeD.js');
const calculateSizeF = require('./calculateSizeF.js');

const buildMainContent = (fullStaticPath, pathname) => {
    let mainContent = '';
    let items;

    //Look items inside the folder
    try{
        items = fs.readdirSync(fullStaticPath);
        //console.log(items);

    }catch(err){
        console.log(`readdirSync: ${err}`);
        return `<div class="alert alert-danger">Internal Server error</div>`;
    }

    //Remove folder project_files
    if(pathname === '/'){
        items = items.filter(element => element !== 'Project_files');
    }

    //Get all elements inside the folder
    items.forEach(item => {

        //Store item details
        let itemDetails = {};
        //Name
        itemDetails.name = item;
        //Link
        const link = path.join(pathname, item);

        const itemFullStaticPath = path.join(fullStaticPath, item);

        try{
            itemDetails.stats = fs.statSync(itemFullStaticPath);
            //console.log(`statSync: ${itemDetails.stats}`);
        }catch(err){
            console.log(`statSync error: ${err}`);
            mainContent = `<div class="alert alert-danger"> internal Server error</div>`;
            return false;
        }
        //Is a directory
        if(itemDetails.stats.isDirectory()){
            itemDetails.icon = '<ion-icon name="folder"></ion-icon>';

            //Verify size of folder
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeD(itemFullStaticPath);
        }
        //Is a file
        else if(itemDetails.stats.isFile()){
            itemDetails.icon = '<ion-icon name="document"></ion-icon>';

            //Verify size of file
            [itemDetails.size, itemDetails.sizeBytes] = calculateSizeF(itemDetails.stats);
        }

        //Get the last modification 
        itemDetails.timeStamp = parseInt(itemDetails.stats.mtimeMs);
        //Convert timestamp
        itemDetails.date = new Date(itemDetails.timeStamp);
        itemDetails.date = itemDetails.date.toLocaleString();
        //console.log(`Date: ${itemDetails.date}`); 
        //console.log(`TimeStamp: ${itemDetails.timeStamp}`); 


        mainContent += `
            <tr data-name="${itemDetails.name}" data-size="${itemDetails.sizeBytes}" data-time="${itemDetails.timeStamp}">
                <td>
                    <a href="${link}" target='${itemDetails.stats.isFile() ? "_blank" : ""}'> 
                        ${itemDetails.icon} ${item} 
                    </a>
                </td>
                <td>${itemDetails.size}</td>
                <td>${itemDetails.date}</td>
            </tr>
        `; 
    });      

    return mainContent;
}

module.exports = buildMainContent;