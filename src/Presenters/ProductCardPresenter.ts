import { EventEmitter } from "../base/Event";
import { ProductModel } from "../Models/ProductModel.";
import { ProductCardView } from "../Views/ProductCardView";

export class ProductCardPresenter {
    constructor(
        private model: ProductModel,
        private view: ProductCardView,
        private events: EventEmitter
    ) {
        this.initialize();
    }

    private initialize() {
        this.setupEventHandlers();
        this.updateView();
    }

    private setupEventHandlers() {
        this.view.onBasketToggle = (inBasket: boolean) => {
            if (inBasket) {
                this.model.addToBasket();
            } else {
                this.events.emit('basket:remove', { id: this.model.id });
            }
            this.updateView();
        };

        this.view.onClick = () => {
            this.events.emit('modal:close');
        };
    }

    private updateView() {
        this.view.render({
            ...this.model.data,
            inBasket: this.model.isInBasket()
        });
    }
}