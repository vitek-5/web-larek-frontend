import { BaseView } from "../base/View";
import { IProduct } from "../Models/ProductModel.";
import { ProductCategories } from "../utils/constants";
import { ensureElement } from "../utils/utils";

export interface ProductViewEvents {
    onClick: () => void;
}

export class ProductView extends BaseView<IProduct> {
    protected image: HTMLImageElement;
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected category: HTMLElement | null;

    constructor(
        container: HTMLElement,
        protected events: ProductViewEvents
    ) {
        super(container);

        this.image = ensureElement<HTMLImageElement>('.card__image', container);
        this.title = ensureElement('.card__title', container);
        this.price = ensureElement('.card__price', container);
        this.category = container.querySelector('.card__category');

        container.addEventListener('click', () => events.onClick());
    }

    render(data: IProduct): HTMLElement {
        this.data = data;
        this.setImage(this.image, data.image, data.title);
        this.setText(this.title, data.title);
        this.setText(this.price, data.price ? `${data.price} синапсов` : 'Бесценно');

        if (this.category) {
            this.setText(this.category, data.category);
            Object.entries(ProductCategories).forEach(([name, className]) => {
                this.category?.classList.toggle(className, name === data.category);
            });
        }

        return this.container;
    }
}