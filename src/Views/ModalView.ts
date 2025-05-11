import { BaseView } from "../base/View";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "../base/Event";

export class ModalView extends BaseView<{ content: HTMLElement }> {
    protected _closeButton: HTMLElement;
    private _isOpened = false;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._closeButton = ensureElement('.modal__close', container);
        this._closeButton.addEventListener('click', this.handleClose.bind(this));

        // Обработчик клика вне контента
        container.addEventListener('click', (e) => {
            if (e.target === container && this._isOpened) {
                this.handleClose();
            }
        });
    }

    private handleClose() {
        if (!this._isOpened) return;

        this._isOpened = false;
        this.container.style.display = 'none';
        document.body.classList.remove('page__wrapper_locked');

        // Важно: эмитим событие только если окно действительно было открыто
        this.events.emit('modal:close');
    }

    open() {
        this._isOpened = true;
        this.container.style.display = 'flex';
        document.body.classList.add('page__wrapper_locked');
        this.events.emit('modal:open');
    }

    close() {
        this.handleClose();
    }

    isOpen(): boolean {
        return this._isOpened;
    }

    render(data: { content: HTMLElement }): HTMLElement {
        const content = ensureElement('.modal__content', this.container);
        content.replaceChildren(data.content);
        this.open();
        return this.container;
    }

    getContent(): HTMLElement | null {
        return this.container.querySelector('.modal__content');
    }
}