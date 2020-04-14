//required node modules
const {execSync} = require('child_process');


const calculateSizeD = itemFullStaticPath => {
    //remove spaces, tabs, etc
    const itemFullStaticPathCleaned = itemFullStaticPath.replace(/\s/g, '\ ');
    const commandOutput = execSync(`du -sh "${itemFullStaticPathCleaned}"`).toString();
    //console.log(`commandOutput: ${commandOutput}`);

    let fileSize = commandOutput.replace(/\s|D:/g, '');
    //fileSize = fileSize.replace('D:', '').split('\\');
    fileSize = fileSize.split('\\');
    fileSize = fileSize[0];
    //console.log(`fileSize: ${fileSize}`);
    
    //File size unit
    const fileSizeUnit = fileSize.replace(/\d|\./g, '').toString();
    //console.log(`fileSizeUnit: ${fileSizeUnit}`);
    
    //File size number
    const fileSizeNumber = parseFloat(fileSize.replace(/[a-z]/i, ''));
    //console.log(`fileSizeNumber: ${fileSizeNumber}`);

    /*  B 10B -> 10 bytes (*1000^0)  
        K 10K -> 10* 1000 bytes (*1000^1)
        M 10M -> 10* 1000*1000 bytes (*1000^2)
        G 10G -> 10* 1000*1000*1000 bytes (*1000^3)
        T 10T -> 10* 1000*1000*1000*1000 bytes (*1000^4)
    */
    
    const units ="BKMGT";
    const fileSizeBytes = fileSizeNumber * Math.pow(1000, units.indexOf(fileSizeUnit));
    //console.log(`fileSizeBytes: ${fileSizeBytes}`);
    
    return [fileSize, fileSizeBytes];
}

module.exports = calculateSizeD;
