import { BaseView } from "../base/View";
import { IProduct } from "../Models/ProductModel.";
import { ensureElement } from "../utils/utils";

export class ProductCardView extends BaseView<IProduct> {
    protected button: HTMLButtonElement;
    private _onBasketToggle: (inBasket: boolean) => void;
    private _onClick: () => void;

    constructor(container: HTMLElement) {
        super(container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);

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

    render(data: IProduct & { inBasket?: boolean }): HTMLElement {
        this.data = data;
        this.updateButton(data.inBasket || false);
        return this.container;
    }

    private updateButton(inBasket: boolean) {
        this.button.textContent = inBasket ? 'Убрать' : 'В корзину';
        this.button.disabled = this.data.price === null;
    }
}