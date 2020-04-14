//10^3 = 1000
console.log(Math.log10(1000)); 
//10^4 =10000
console.log(Math.log10(10000)); 

//Const fileSize in bytes
const fileSize = 25416812458; 
const unit = 'BKMGT';

//  ....1000....1000000....1000000000
//log10
//  ....3.......6.........9
//log10(fileSize)/3
// 0....1.......2.........3

const index = Math.floor(Math.log10(fileSize)/3);

//Value in bytes convert to human readable number
//700b -> 700/1000^0
//1000b -> 10000/1000^1
//10000000b -> 10000000/1000^2

const fileSizeHuman = (fileSize/Math.pow(1000, index)).toFixed(1);

console.log(`value: ${fileSize} \n Converted: ${fileSizeHuman} ${unit[index]}`);