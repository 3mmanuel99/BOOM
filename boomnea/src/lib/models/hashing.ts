class Node {
    data: string;
    next: null;

    constructor(data: string) {
        this.data = data;
        this.next = null;
    }

    insertAtFront(head, x)

    
}

class Hashing {
    size: number;
    table: Array<string>;

    constructor(size: number) {
        this.size = size;
        this.table = Array(size)
    }

    hashFunc(data: string): number {
        let hashValue: number = 0;

        data.split('').forEach(element => {
            hashValue = ((hashValue << 5) + hashValue) + element.charCodeAt(0);
        })
        return hashValue;
    }

    insert(data: string): void {
        const index = this.hashFunc(data);

        if (this.table[index] === "") {
            this.table[index] = data
        } else {
            // collision handling
        }
    }

    get(data: string): string | void {
        const index = this.hashFunc(data);

        return this.table[index];
    }

    delete(data: string): void {
        const index = this.hashFunc(data);

        this.table[index] = ""
    }
}