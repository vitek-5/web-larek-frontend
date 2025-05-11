import { BaseView } from "../base/View";
import { IProduct } from "../Models/ProductModel.";
import { ensureElement } from "../utils/utils";

export class ProductCardView extends BaseView<IProduct> {
    protected image: HTMLImageElement;
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected category: HTMLElement;
    protected description: HTMLElement;
    protected button: HTMLButtonElement;
    private _onBasketToggle: (inBasket: boolean) => void;
    private _onClick: () => void;

    constructor(container: HTMLElement) {
        super(container);

        // Инициализируем все элементы
        this.image = ensureElement<HTMLImageElement>('.card__image', container);
        this.title = ensureElement('.card__title', container);
        this.price = ensureElement('.card__price', container);
        this.category = ensureElement('.card__category', container);
        this.description = ensureElement('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);

        // Инициализируем data пустым объектом
        this.data = {
            id: '',
            title: '',
            price: null,
            category: '',
            description: '',
            image: '',
            inBasket: false
        };

        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentState = this.button.textContent === 'Убрать';
            if (this._onBasketToggle) {
                this._onBasketToggle(!currentState);
            }
        });

        container.addEventListener('click', () => {
            if (this._onClick) this._onClick();
        });
    }

    set onBasketToggle(callback: (inBasket: boolean) => void) {
        this._onBasketToggle = callback;
    }

    set onClick(callback: () => void) {
        this._onClick = callback;
    }

    render(data: Partial<IProduct> & { inBasket?: boolean }): HTMLElement {
        // Обновляем data с новыми значениями
        Object.assign(this.data, data);

        if (data.image) this.setImage(this.image, data.image, data.title);
        if (data.title) this.setText(this.title, data.title);
        if (data.price !== undefined) {
            this.setText(this.price, data.price ? `${data.price} синапсов` : 'Бесценно');
        }
        if (data.category) this.setText(this.category, data.category);
        if (data.description) this.setText(this.description, data.description);

        this.updateButton(data.inBasket || false);
        return this.container;
    }

    private updateButton(inBasket: boolean) {
        this.button.textContent = inBasket ? 'Убрать' : 'В корзину';
        this.button.disabled = this.data.price === null;
    }

    updateButtonState(inBasket: boolean) {
        this.button.textContent = inBasket ? 'Убрать' : 'В корзину';
        this.button.disabled = this.data.price === null;
    }
}