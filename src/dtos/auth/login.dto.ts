export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
