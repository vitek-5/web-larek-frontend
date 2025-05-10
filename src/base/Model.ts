import { EventEmitter } from "./Event";

export abstract class BaseModel<T extends object> {
    constructor(protected data: T, protected events: EventEmitter) {}

    protected emit(event: string, payload?: object) {
        this.events.emit(event, payload ?? this.data);
    }

    getData(): T {
        return this.data;
    }

    update(data: Partial<T>) {
        Object.assign(this.data, data);
        this.emit('model:updated');
    }
}