export class UserConstraints {

    static user(username: string) {
        const usernameRegExReq = new RegExp("(([A-Za-z])+([0-9])*?([^!@#$%^&*]))^.{3,20}");

        return usernameRegExReq.test(username);
    }
    static password(password: string) {
        const passwordRegExReq = new RegExp("(([A-Z])+([a-z])*?([0-9])+)^.{8,16}")
        return passwordRegExReq.test(password);
    }
}

console.log(UserConstraints.user("Chibuikem01"))