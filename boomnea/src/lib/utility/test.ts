function test(t: any): any {
    return typeof t;
}
function test2<Type>(t: Type) {
    return typeof t;
}

console.log(test2("hi"))