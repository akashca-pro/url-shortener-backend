export interface SignupRequestDTO {
    name: string;
    email: string;
    password: string;
}

export interface SignupResponseDTO {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
