import { BaseView } from "../base/View";
import { EventEmitter } from "../base/Event";
import { ensureElement } from "../utils/utils";


export class ModalView extends BaseView<{ content: HTMLElement }> {
    private closeButton: HTMLElement;
    private content: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.closeButton = ensureElement('.modal__close', container);
        this.content = ensureElement('.modal__content', container);

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (e) => {
            if (e.target === container) this.close();
        });
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    render(data: { content: HTMLElement }): HTMLElement {
        this.content.replaceChildren(data.content);
        this.open();
        return this.container;
    }

    getContent(): HTMLElement | null {
        return this.container.querySelector('.modal__content');
    }
}