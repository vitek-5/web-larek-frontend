import { BaseView } from "../base/View";
import { ensureElement } from "../utils/utils";
import { IProduct } from "../Models/ProductModel.";
import { EventEmitter } from "../base/Event";

export class BasketItemView extends BaseView<IProduct> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
        this.deleteButton = ensureElement('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.data && this.data.id) {
                events.emit('basket:remove', { id: this.data.id });
            }
        });
    }

    render(data: IProduct & { index?: number }): HTMLElement {
        if (!data) {
            console.error('BasketItemView: No data provided');
            return this.container;
        }

        this.data = data;
        this.setText(this.indexElement, String((data.index || 0) + 1));
        this.setText(this.titleElement, data.title || 'Неизвестный товар');
        this.setText(this.priceElement, data.price ? `${data.price} синапсов` : 'Бесценно');
        return this.container;
    }
}