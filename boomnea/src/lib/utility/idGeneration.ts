export class IDGenerators {
    combination: string;
    users: string;
    questions: string;
    gamecodes: string;
    messages: string;

    constructor()
    {
        this.combination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        this.users = "US-";
        this.questions = "QN-";
        this.gamecodes = "BM-";
        this.messages = "MS-";
    }


    public questionIdGenerator(): string
    {
         
        for (let i = 0; i < 10; i++)
        {
            /* adding each character from the string into the variable
            the concat function combines multiple characters into a single string
            */
            this.questions += "".concat(this.combination[Math.floor(Math.random() * this.combination.length)]);
            /* Math.floor() will return a whole number, while Math.random() will return a number between 0 and 1.
            the former is needed as you cannot access a position in an array with a fractional number. the multi-
            plication step comes in as it steps up the range from 0 and 1 to a much larger range, putting it from 0
            to the length of the string combination (62).
            */
        }
        return this.questions; // returning the id that has been generated
    }


    public userIdGeneration(): string {
        for (let i = 0; i < 10; i++)
        {
            this.users += "".concat(this.combination[Math.floor(Math.random() * this.combination.length)]);
        }
        return this.users; 
    }
    public gamecodeIdGeneration(): string {
      // instead of looping 10 times like we are doing for other id generators, we will be looping only 5 for the convenience of the user(s)
        for (let i = 0; i < 10; i++)
        {
            this.gamecodes += "".concat(this.combination[Math.floor(Math.random() * this.combination.length)])
        }
        return this.gamecodes; // returning the gamecode that has been generated
    }

    public messageIdGeneration(): string {
        for (let i = 0; i < 10; i++)
        {
            this.messages = "".concat(this.combination[Math.floor(Math.random() * this.combination.length)])
        }

        return this.messages;
    }
}