export abstract class BaseView<T = unknown> {
    protected data: T;

    constructor(protected container: HTMLElement) {}

    protected setText(element: HTMLElement, value: unknown) {
        if (element) element.textContent = String(value);
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    abstract render(data?: Partial<T>): HTMLElement;
}