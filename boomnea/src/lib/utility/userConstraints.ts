// userConstraints.ts

export class UserConstraints {

    static user(username: string) {
        const usernameRegExReq = new RegExp("^((?=.*[a-z])(?!.[!@#$%^&*])).{3,16}$");
        return usernameRegExReq.test(username);
    }
    static password(password: string) {
        const passwordRegExReq = new RegExp("^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])).{8,64}$")
        return passwordRegExReq.test(password);
    }
}