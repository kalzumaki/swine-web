export interface RegisterFormResponse {
    message: string;
    user: {
        id: string;
        user_type: string;
        fname: string;
        lname: string;
        email: string;
        username: string;
    },
    verification_sent: boolean;
}

export interface RegisterFormData {
    fname: string;
    lname: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}