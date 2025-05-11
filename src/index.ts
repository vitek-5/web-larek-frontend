import './scss/styles.scss';
import { EventEmitter } from "./base/Event";
import { AppState } from "./Models/AppState";
import { ApiService } from "./base/ApiService";
import { AppPresenter } from "./Presenters/AppPresenter";
import { PageView } from "./Views/PageView";
import { ModalView } from "./Views/ModalView";
import { BasketView } from "./Views/BasketView";
import { OrderFormView } from "./Views/OrderFormView";
import { ContactsFormView } from "./Views/ContactsFormView";
import { SuccessView } from "./Views/SuccessView";
import { BasketPresenter } from "./Presenters/BasketPresenter";
import { OrderFormsPresenter } from "./Presenters/OrderFormsPresenter";
import { ensureElement, cloneTemplate } from "./utils/utils";

// Инициализация
const events = new EventEmitter();
const api = new ApiService(process.env.API_ORIGIN);
const state = new AppState(events);

// Создание представлений
const views = {
    pageView: new PageView(document.body, events),
    modalView: new ModalView(ensureElement('#modal-container'), events),
    basketView: new BasketView(cloneTemplate('#basket'), events),
    orderFormView: new OrderFormView(cloneTemplate('#order'), events),
    contactsFormView: new ContactsFormView(cloneTemplate('#contacts'), events),
    successView: new SuccessView(cloneTemplate('#success')) // Теперь без events
};

// Создание презентеров
new BasketPresenter(state, views.basketView, events);
new OrderFormsPresenter(state, views.orderFormView, views.contactsFormView, events, api);
new AppPresenter(state, events, api, views);

// Обработчики ошибок
events.on('catalog:error', (error: { message: string }) => {
    console.error('Catalog error:', error.message);
});

events.on('order:error', (error: { message: string }) => {
    console.error('Order error:', error.message);
});
