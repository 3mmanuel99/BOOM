import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt(8);
const h = await bcrypt.hash("test", salt)
console.log(salt);
console.log(h);