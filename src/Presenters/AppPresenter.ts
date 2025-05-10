import { AppState } from "../Models/AppState";
import { PageView } from "../Views/PageView";
import { BasketView } from "../Views/BasketView";
import { ModalView } from "../Views/ModalView";
import { OrderFormView } from "../Views/OrderFormView";
import { SuccessView } from "../Views/SuccessView";
import { ProductView } from "../Views/ProductView";
import { BasketPresenter } from "./BasketPresenter";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { IProduct, ProductModel } from "../Models/ProductModel.";
import { ProductCardView } from "../Views/ProductCardView";
import { ContactsFormView } from "../Views/ContactsFormView";
import { OrderFormsPresenter } from "./OrderFormsPresenter";
import { ApiService } from "../base/ApiService";
import { EventEmitter } from "../base/Event";
import { ProductCardPresenter } from "./ProductCardPresenter";

interface CatalogLoadingEvent {
    isLoading: boolean;
}

interface CatalogErrorEvent {
    message: string;
}

export class AppPresenter {
    private modal: ModalView;
    private basketView: BasketView;
    private orderFormView: OrderFormView;
    private contactsFormView: ContactsFormView;
    private successView: SuccessView;
    private pageView: PageView;

    constructor(
        private state: AppState,
        private events: EventEmitter,
        private api: ApiService
    ) {
        this.initializeViews();
        this.initializePresenters();
        this.setupEventHandlers();
        this.loadCatalog();
    }

    private initializeViews() {
        this.pageView = new PageView(document.body, this.events);
        this.modal = new ModalView(ensureElement('#modal-container'), this.events);
        this.basketView = new BasketView(cloneTemplate('#basket'), this.events);
        this.orderFormView = new OrderFormView(cloneTemplate('#order'), this.events);
        this.contactsFormView = new ContactsFormView(cloneTemplate('#contacts'), this.events);
        this.successView = new SuccessView(cloneTemplate('#success'), this.events);
    }

    private initializePresenters() {
        new BasketPresenter(this.state, this.basketView, this.events);
        new OrderFormsPresenter(
            this.state,
            this.orderFormView,
            this.contactsFormView,
            this.events,
            this.api
        );
    }

    private setupEventHandlers() {
        this.events.on('basket:open', () => {
            this.modal.render({
                content: this.basketView.render({
                    items: this.state.getBasketItems(),
                    total: this.state.getBasketTotal()
                })
            });
        });

        this.events.on('order:start', () => {
            this.modal.render({
                content: this.orderFormView.render({
                    payment: '',
                    address: '',
                    email: '',
                    phone: '',
                    valid: false,
                    errors: {}
                })
            });
        });

        this.events.on('contacts:open', () => {
            this.modal.render({
                content: this.contactsFormView.render({
                    ...this.orderFormView.getData(),
                    valid: false,
                    errors: {}
                })
            });
        });

        this.events.on('order:success', (event: { id: string, total: number }) => {
            this.state.clearBasket();
            this.modal.render({
                content: this.successView.render({
                    total: event.total
                })
            });
            this.updateBasketCounter();
        });

        this.events.on('modal:open', () => this.pageView.setLocked(true));
        this.events.on('modal:close', () => this.pageView.setLocked(false));
        this.events.on('basket:changed', () => {
            this.updateBasketCounter();
            const modalContent = this.modal.getContent();
            if (modalContent?.querySelector('#card-preview')) {
                const cardElement = modalContent.querySelector('.card');
                const productId = cardElement?.getAttribute('data-id');
                if (productId) {
                    const product = this.state.getCatalog().find(p => p.id === productId);
                    if (product) {
                        this.showProductPreview(product.data);
                    }
                }
            }
        });
    }

    private async loadCatalog() {
        try {
            this.events.emit('catalog:loading', { isLoading: true } as CatalogLoadingEvent);

            const products = await this.api.getProducts();
            const productModels = products.map(product => new ProductModel({
                ...product,
                inBasket: this.state.isInBasket(product.id)
            }, this.events));

            this.state.setCatalog(productModels);
            this.renderProductCatalog();

            this.events.emit('catalog:loading', { isLoading: false } as CatalogLoadingEvent);
        } catch (error) {
            console.error('Failed to load catalog:', error);
            this.events.emit('catalog:error', {
                message: error instanceof Error ? error.message : 'Ошибка загрузки каталога'
            } as CatalogErrorEvent);
        }
    }

    private renderProductCatalog() {
        const gallery = ensureElement('.gallery');
        gallery.innerHTML = '';

        this.state.getCatalog().forEach((product: ProductModel) => {
            const productElement = cloneTemplate('#card-catalog');
            const productView = new ProductView(productElement, {
                onClick: () => this.showProductPreview(product.data)
            });

            productView.render(product.data);
            gallery.appendChild(productElement);
        });

        this.updateBasketCounter();
    }

    private showProductPreview(productData: IProduct) {
        const previewElement = cloneTemplate('#card-preview');
        const product = new ProductModel(productData, this.events);
        product.renderID(previewElement);

        const previewView = new ProductCardView(previewElement);
        new ProductCardPresenter(product, previewView, this.events);

        previewView.render({
            ...product.data,
            inBasket: this.state.isInBasket(product.id)
        });

        this.modal.render({
            content: previewElement
        });
    }

    private updateBasketCounter() {
        this.pageView.render({
            counter: this.state.getBasketCount()
        });
    }
}