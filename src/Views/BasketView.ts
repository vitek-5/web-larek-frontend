import { EventEmitter } from "../base/Event";
import { BaseView } from "../base/View";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { ProductModel } from "../Models/ProductModel.";

interface BasketData {
    items: ProductModel[];
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
            data.items.forEach((item, index) => {
                const itemElement = cloneTemplate('#card-basket');
                itemElement.querySelector('.card__title').textContent = item.title;
                itemElement.querySelector('.card__price').textContent =
                    item.price ? `${item.price} синапсов` : 'Бесценно';
                itemElement.querySelector('.basket__item-index').textContent = String(index + 1);

                const deleteButton = itemElement.querySelector('.basket__item-delete');
                deleteButton?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.events.emit('basket:remove', { id: item.id });
                });

                this.list.appendChild(itemElement);
            });
            this.button.disabled = false;
        }

        this.setText(this.total, `${data.total} синапсов`);
        return this.container;
    }

    onCheckout(callback: () => void) {
        this.button.addEventListener('click', callback);
    }
}
