import { BaseView } from "../base/View";
import { EventEmitter } from "../base/Event";
import { ensureElement } from "../utils/utils";

interface PageData {
    counter: number;
}

export class PageView extends BaseView<PageData> {
    private counter: HTMLElement;
    private basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.counter = ensureElement('.header__basket-counter', container);
        this.basketButton = ensureElement('.header__basket', container);

        this.basketButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    render(data: PageData): HTMLElement {
        this.setText(this.counter, String(data.counter));
        return this.container;
    }

    setLocked(locked: boolean) {
        this.container.classList.toggle('page__wrapper_locked', locked);
    }
}