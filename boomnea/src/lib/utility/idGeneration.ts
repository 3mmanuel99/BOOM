export class IDGenerators {
    static readonly combination: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    static USERS: string = "US-";
    static QUESTIONS: string = "QN-";
    static GAMECODES: string = "BM-";
    static MESSAGES: string = "MS-";

    private static idGen(): string {
        let id: string = ""
        for (let i = 0; i < 10; i++)
        {
            /* adding each character from the string into the variable
            the concat function combines multiple characters into a single string
            */
            id += "".concat(this.combination[Math.floor(Math.random() * this.combination.length)]);
            /* Math.floor() will return a whole number, while Math.random() will return a number between 0 and 1.
            the former is needed as you cannot access a position in an array with a fractional number. the multi-
            plication step comes in as it steps up the range from 0 and 1 to a much larger range, putting it from 0
            to the length of the string combination (62).
            */
        }
        return id; // returning the id that has been generated
    }

    static questionIdGeneration(): string
    {
        this.QUESTIONS += this.idGen();
        return this.QUESTIONS; 
    }

    static userIdGeneration(): string {
        this.USERS += this.idGen();
        return this.USERS; 
    }

    static gamecodeIdGeneration(): string {
        // slicing for a 5 digit gamecode
        this.GAMECODES += this.idGen().slice(0, 5)
        return this.GAMECODES; 
    }

    static messageIdGeneration(): string {
        this.MESSAGES += this.idGen()
        return this.MESSAGES;
    }
}