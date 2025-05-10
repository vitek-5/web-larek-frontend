import { ProductModel } from "../Models/ProductModel.";
import { ProductView } from "../Views/ProductView";

export class ProductPresenter {
    constructor(
        private model: ProductModel,
        private view: ProductView,
    ) {
        this.initialize();
    }

    private initialize() {
        this.updateView();
        this.setupEventHandlers();
    }

    private updateView() {
        this.view.render(this.model.data);
    }

    private setupEventHandlers() {
        // Подписываемся на изменения модели
        this.model.onChange(() => this.updateView());
    }
}