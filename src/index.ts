import { EventEmitter } from "./base/Event";
import { AppState } from "./Models/AppState";
import { AppPresenter } from "./Presenters/AppPresenter";
import { ApiService } from "./base/ApiService";
import './scss/styles.scss';

// Инициализация приложения
const events = new EventEmitter();
const state = new AppState(events);
const api = new ApiService(process.env.API_ORIGIN); // Передаем базовый URL API

events.on('catalog:error', (error: { message: string }) => {
    console.error('Catalog error:', error.message);
    // Можно показать сообщение об ошибке пользователю
});

events.on('order:error', (error: { message: string }) => {
    console.error('Order error:', error.message);
    // Можно показать сообщение об ошибке пользователю
});

new AppPresenter(state, events, api);
