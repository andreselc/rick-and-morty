export interface IRespository <T> {
    create(request: T): void;
}