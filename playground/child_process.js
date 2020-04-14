// Syntax using ES6
const {execSync} = require('child_process');

try{
    const result = execSync(`du -sh "D:/Allan/JavaScript/NodeJs/Projects/File\ Explorer\ NodeJS"`).toString();
    //console.log(result);

}catch(err){
    console.log(`execSync: ${err}`);
}

//console.log(child_process.execSync('dir').toString());
