export class IDGenerators {
    combination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    users = "US-";
    questions = "QN-";
    gamecodes = "BM-";
    messages = "MS-";


    static questionIdGenerator(): string
    {

        this.
         
        for (let i = 0; i < 10; i++)
        {
            /* adding each character from the string into the variable
            the concat function combines multiple characters into a single string
            */
            IDusers += "".concat(this.combination[Math.floor(Math.random() * combination.length)]);
            /* Math.floor() will return a whole number, while Math.random() will return a number between 0 and 1.
            the former is needed as you cannot access a position in an array with a fractional number. the multi-
            plication step comes in as it steps up the range from 0 and 1 to a much larger range, putting it from 0
            to the length of the string combination (62).
            */
        }
        return id; // returning the id that has been generated
    }
    static userIdGeneration(): string {
        const combination: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let id: string = "US-";  
        for (let i = 0; i < 10; i++)
        {
            id += "".concat(combination[Math.floor(Math.random() * combination.length)]);
        }
        return id; 
    }
    static gamecodeIdGeneration(): string {
        const combination: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let gamecode: string = "BM-";

        // instead of looping 10 times like we are doing for other id generators, we will be looping only 5 for the convenience of the user(s)
        for (let i = 0; i < 10; i++)
        {
            gamecode += "".concat(combination[Math.floor(Math.random() * combination.length)])
        }
        return gamecode; // returning the gamecode that has been generated
    }

    static messageIdGeneration(): string {
        const combination = string "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        let gamecode: string = 
    }
}
