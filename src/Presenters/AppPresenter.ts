import { AppState } from "../Models/AppState";
import { PageView } from "../Views/PageView";
import { BasketView } from "../Views/BasketView";
import { ModalView } from "../Views/ModalView";
import { OrderFormView } from "../Views/OrderFormView";
import { SuccessView } from "../Views/SuccessView";
import { ProductView } from "../Views/ProductView";
import { BasketPresenter } from "./BasketPresenter";
import { ensureElement, cloneTemplate } from "../utils/utils";
import { ProductModel } from "../Models/ProductModel.";
import { ProductCardView } from "../Views/ProductCardView";
import { ContactsFormView } from "../Views/ContactsFormView";
import { OrderFormsPresenter } from "./OrderFormsPresenter";
import { ApiService } from "../base/ApiService";
import { EventEmitter } from "../base/Event";
import { BasketItemView } from "../Views/BasketItemView";

interface AppViews {
    pageView: PageView;
    modalView: ModalView;
    basketView: BasketView;
    orderFormView: OrderFormView;
    contactsFormView: ContactsFormView;
    successView: SuccessView;
}

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
        private api: ApiService,
        private views: AppViews) {
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
        this.successView = new SuccessView(cloneTemplate('#success'));
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

        this.events.on('basket:open', () => this.openBasket());
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

        // Обработка открытия успешного заказа
        this.events.on('order:success', (event: { total: number }) => {
            const successElement = cloneTemplate('#success');
            const successView = new SuccessView(successElement);

            successElement.addEventListener('success:close', () => {
                this.modal.close();
            });

            this.modal.render({
                content: successView.render({ total: event.total })
            });
        });

        // Общий обработчик закрытия
        this.events.on('modal:close', () => {
            this.pageView.setLocked(false);
        });

        this.events.on('modal:open', () => this.pageView.setLocked(true));
        // Закрытие через крестик
        this.events.on('modal:close', () => { this.pageView.setLocked(false); });

        // Закрытие через кнопку в SuccessView
        this.events.on('success:close', () => {
            this.modal.close();
            this.pageView.setLocked(false);

            // Дополнительные действия при закрытии через success (если нужны)
            this.events.emit('order:completed');
        });

        this.events.on('basket:changed', () => {
            this.updateBasketCounter();

            // Обновляем превью товара, если модальное окно открыто
            const modalContent = this.modal.getContent();
            if (modalContent && this.modal.isOpen()) { // Теперь isOpen() существует
                const previewCard = modalContent.querySelector('.card');
                if (previewCard) {
                    const productId = previewCard.getAttribute('data-id');
                    if (productId) {
                        const product = this.state.getCatalog().find(p => p.id === productId);
                        if (product) {
                            // Обновляем кнопку в превью
                            const button = previewCard.querySelector('.card__button');
                            if (button) {
                                button.textContent = this.state.isInBasket(productId) ? 'Убрать' : 'В корзину';
                            }
                        }
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
        const galleryItems = this.state.getCatalog().map(product => {
            const productElement = cloneTemplate('#card-catalog');
            const productView = new ProductView(productElement, {
                onClick: () => this.showProductPreview(product)
            });
            return productView.render(product.data);
        });

        this.pageView.setGalleryItems(galleryItems);
        this.updateBasketCounter();
    }

    private showProductPreview(product: ProductModel) {
        const previewElement = cloneTemplate('#card-preview');
        const previewView = new ProductCardView(previewElement);

        // Устанавливаем атрибут data-id для поиска карточки позже
        previewElement.querySelector('.card')?.setAttribute('data-id', product.id);

        previewView.onBasketToggle = (inBasket: boolean) => {
            if (inBasket) {
                product.addToBasket();
            } else {
                product.removeFromBasket();
            }
            // После изменения корзины сразу обновляем кнопку
            previewView.updateButtonState(this.state.isInBasket(product.id));
        };

        previewView.onClick = () => {
            this.events.emit('modal:close');
        };

        const renderedPreview = previewView.render({
            ...product.data,
            inBasket: this.state.isInBasket(product.id)
        });

        this.modal.render({
            content: renderedPreview
        });
    }

    private openBasket() {
        const basketItems = this.state.getBasketItems()
            .filter(item => item && item.data) // Фильтруем невалидные элементы
            .map((item, index) => {
                const element = cloneTemplate('#card-basket');
                const view = new BasketItemView(element, this.events);
                return view.render({
                    ...item.data,
                    index
                });
            });

        const renderedBasket = this.basketView.render({
            items: basketItems,
            total: this.state.getBasketTotal()
        });

        this.modal.render({
            content: renderedBasket
        });
    }

    private updateBasketCounter() {
        this.pageView.render({
            counter: this.state.getBasketCount()
        });
    }
}