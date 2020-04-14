//required node modules
const {execSync} = require('child_process');


const calculateSizeF = stats => {
    //File size in bytes
    const fileSizeBytes = stats.size;
    //File unit
    const unit = 'BKMGT';
    //Find the index of const unit
    const index = Math.floor(Math.log10(fileSizeBytes)/3);
    //Convert fileSizeBytes according to proper unit
    const fileSizeHuman = (fileSizeBytes/Math.pow(1000, index)).toFixed(1);
    //console.log(`value: ${fileSizeBytes} \nConverted: ${fileSizeHuman} ${unit[index]}`);
    
    fileSize = `${fileSizeHuman}${unit[index]}`;

    return [fileSize, fileSizeBytes];
}

module.exports = calculateSizeF;
