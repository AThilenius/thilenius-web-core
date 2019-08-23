export declare class Event<TArgs = void> {
    private handlers;
    add(handler: (args: TArgs) => void): void;
    remove(handler: (args: TArgs) => void): void;
    fire(args: TArgs): void;
}
