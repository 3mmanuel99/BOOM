/*
import { queries } from "./database.ts";

const { data } = await queries
    .from("UGQuestion")
    .select("*")


const testObj = {
    name: "Emmanuel",
    test: "ok",
    questions: [{}]
}   

for (let i = 0; i < data!.length; i++) {
    testObj.questions[i] = data?.[i];
}


console.log(testObj)
*/

const testobj: object = {
    name: "Emmanuel",
    age: 17
}

console.log(Object.keys(testobj).length)