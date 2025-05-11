import { EventEmitter } from "../base/Event";
import { BaseView } from "../base/View";
import { ensureElement } from "../utils/utils";

interface BasketData {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends BaseView<BasketData> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected events: EventEmitter
    ) {
        super(container);
        this.list = ensureElement('.basket__list', container);
        this.total = ensureElement('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.button.addEventListener('click', () => {
            events.emit('order:start');
        });
    }

    render(data: BasketData): HTMLElement {
        this.list.innerHTML = '';

        if (data.items.length === 0) {
            this.list.innerHTML = '<p>Корзина пуста</p>';
            this.button.disabled = true;
        } else {
            data.items.forEach(item => this.list.appendChild(item));
            this.button.disabled = false;
        }

        this.setText(this.total, `${data.total} синапсов`);
        return this.container;
    }

    onCheckout(callback: () => void) {
        this.button.addEventListener('click', callback);
    }
}
