import { queries } from "../database/database.ts";

const thing = await queries
    .from("User")
    .insert({
        UserID: "69696969",
        Username: "emmanuel",
        Password: "69420",
        CreatedAt: new Date()
    })
console.log(thing)