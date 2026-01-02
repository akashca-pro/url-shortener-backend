export interface ResponseDTO<T> {
    data: T;
    success: boolean;
    errorMessage?: string;
}
