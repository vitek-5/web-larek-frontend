# Web-Ларёк

## 📌 Описание

Проект реализован по архитектурному паттерну **MVP (Model-View-Presenter)**:
- **Model** - работа с данными (API, состояние приложения)
- **View** - отображение интерфейса и обработка пользовательских действий
- **Presenter** (через EventEmitter) - координация между Model и View

Стек: HTML, SCSS, TS, Webpack

Структура проекта

src/
├── base/ # Базовые классы
│ ├── Api.ts # HTTP-клиент
│ ├── Event.ts # Шина событий
│ ├── Model.ts # Базовый класс модели
│ └── View.ts # Базовый класс представления
├── Models/ # Модели данных
│ ├── AppState.ts # Глобальное состояние
│ ├── BasketModel.ts # Корзина
│ ├── OrderModel.ts # Заказы
│ └── ProductModel.ts # Товары
├── Presenters/ # Презентеры
│ ├── AppPresenter.ts # Главный координатор
│ ├── BasketPresenter.ts
│ └── OrderFormsPresenter.ts
├── Views/ # UI компоненты
│ ├── BasketView.ts # Корзина
│ ├── ProductView.ts # Карточка товара
│ ├── ModalView.ts # Модальные окна
│ └── ... # Другие компоненты
├── utils/ # Вспомогательные функции
│ ├── constants.ts # Константы приложения
│ └── utils.ts # Утилиты работы с DOM
├── scss/ # Стили
└── index.ts # Точка входа


## Архитектура приложения
При постоение приложения используется архитектурный паттерн Model-View-Presenter (MVP), который делит модули на три слоя:
- Модель (Model) - Cодержит данные приложения;
- Представление (View) - Показывает эти данные в понятном для пользователя виде;
- Презентер (Presenter) - Отвечает за логику обработки данных, обновления представления и обработки пользовательских команд.

### Слои архитектуры:
1. **Model**:
   - `AppState` - центральное состояние приложения
   - `ProductModel`, `BasketModel`, `OrderModel` - модели данных
   - `ApiService` - работа с API

2. **View**:
   - `PageView`, `ModalView`, `BasketView` - основные компоненты
   - `ProductView`, `ProductCardView` - отображение товаров
   - `OrderFormView`, `ContactsFormView` - формы заказа
   - `SuccessView` - успешное оформление

3. **Presenter**:
   - `AppPresenter` - главный презентер
   - `BasketPresenter`, `OrderFormsPresenter` - управление логикой
   - `ProductPresenter`, `ProductCardPresenter` - работа с товарами

4. **Base**:
   - `EventEmitter` - брокер событий
   - `BaseModel`, `BaseView` - базовые классы
   - `Api` - базовый класс для работы с API

Вот подробное описание всех классов из вашего проекта, с сохранением исходной структуры и данных:

---

### **Модели (Models)**

#### **AppState.ts**
Центральный класс для управления состоянием приложения. Отслеживает:
- Товары в каталоге (`catalog`)
- Товары в корзине (`basket`)
- Взаимодействует с `EventEmitter` для уведомлений об изменениях

**Ключевые методы:**
```typescript
getBasketItems(): ProductModel[] // Возвращает товары в корзине
addToBasket(product: ProductModel) // Добавляет товар в корзину
removeFromBasket(event: { id: string }) // Удаляет товар по ID
setCatalog(products: ProductModel[]) // Обновляет каталог товаров
getBasketTotal() // Считает общую сумму корзины
```

---

#### **BasketModel.ts**
Наследуется от `BaseModel`, управляет состоянием корзины.

**Структура данных:**
```typescript
interface BasketData {
  items: ProductModel[];
  total: number;
}
```

**Методы:**
```typescript
addItem(product: ProductModel) // Добавляет товар
removeItem(id: string) // Удаляет товар по ID
clear() // Очищает корзину
private calculateTotal() // Пересчитывает сумму
```

---

#### **OrderModel.ts**
Наследуется от `BaseModel`, обрабатывает данные заказа.

**Поля формы:**
```typescript
{
  payment: '',
  address: '',
  email: '',
  phone: ''
}
```

**Валидация:**
```typescript
validate(): boolean // Проверяет заполнение полей
```

---

#### **ProductModel.ts**
Модель товара с бизнес-логикой.

**Свойства:**
```typescript
id: string
title: string
price: number | null
category: string
description: string
image: string
inBasket?: boolean
```

**Методы:**
```typescript
toggleBasket() // Переключает состояние корзины
addToBasket() // Генерирует событие 'basket:add'
removeFromBasket() // Генерирует событие 'basket:remove'
renderID(element) // Устанавливает data-id элемента
```

---

### **Представления (Views)**

#### **BasketView.ts**
Отображает корзину товаров.

**Элементы DOM:**
```typescript
list: HTMLElement // Список товаров
total: HTMLElement // Общая сумма
button: HTMLButtonElement // Кнопка оформления
```

**Особенности:**
- Динамически генерирует список из шаблона `#card-basket`
- Обрабатывает клики по кнопке удаления

---

#### **ContactsFormView.ts**
Форма контактов для заказа.

**Элементы:**
```typescript
emailInput: HTMLInputElement
phoneInput: HTMLInputElement
submitButton: HTMLButtonElement
errorContainer: HTMLElement
```

**Логика:**
- Отправляет события при изменении полей:
  ```typescript
  'order.email:change'
  'order.phone:change'
  ```

---

#### **ModalView.ts**
Управляет модальными окнами.

**API:**
```typescript
open() // Показывает модальное окно
close() // Скрывает модальное окно
render(data: { content: HTMLElement }) // Вставляет контент
```

**Обработчики:**
- Закрытие по клику на крестик или вне контента

---

#### **OrderFormView.ts**
Форма оплаты и адреса.

**Элементы:**
```typescript
paymentButtons: HTMLButtonElement[] // Кнопки способов оплаты
addressInput: HTMLInputElement // Поле адреса
nextButton: HTMLButtonElement // Кнопка продолжения
```

**События:**
```typescript
'order.payment:change'
'order.address:change'
'order:next'
```

---

#### **ProductCardView.ts**
Карточка товара в превью.

**Особенности:**
- Управляет кнопкой "В корзину/Убрать"
- Коллбэки:
  ```typescript
  onBasketToggle: (inBasket: boolean) => void
  onClick: () => void
  ```

---

#### **ProductView.ts**
Базовая карточка товара в каталоге.

**Отображает:**
- Изображение (`card__image`)
- Название (`card__title`)
- Цену (`card__price`)
- Категорию (с CSS-классом из `ProductCategories`)

---

### **Презентеры (Presenters)**

#### **AppPresenter.ts**
Координирует работу всего приложения.

**Основные обязанности:**
1. Инициализация всех View и Presenter
2. Загрузка каталога через API:
   ```typescript
   api.getProducts()
   ```
3. Обработка глобальных событий:
   ```typescript
   'basket:open', 'order:start', 'order:success'
   ```

---

#### **BasketPresenter.ts**
Связывает `BasketModel` и `BasketView`.

**Логика:**
- Реагирует на `basket:changed`
- Обновляет отображение корзины

---

#### **OrderFormsPresenter.ts**
Управляет процессом оформления заказа.

**Функционал:**
- Валидация форм
- Подготовка данных заказа
- Отправка через `api.createOrder()`

---

#### **ProductCardPresenter.ts**
Обрабатывает взаимодействия с карточкой товара.

**Реагирует на:**
- Клик по кнопке корзины
- Закрытие модального окна

---

### **Базовые классы**

#### **BaseView.ts**
Абстрактный класс для всех View.

**Основные методы:**
```typescript
setText(element, value) // Безопасное обновление текста
setImage(element, src, alt) // Установка изображения
toggleClass(element, className) // Управление классами
abstract render() // Должен быть реализован
```

#### **BaseModel.ts**
Базовый класс для моделей.

**Функционал:**
```typescript
emit(event, payload) // Отправка событий
getData() // Получение данных
update(data) // Частичное обновление
```

---

### **Утилиты**

#### **utils.ts**
Содержит вспомогательные функции:

1. **Работа с DOM:**
   ```typescript
   ensureElement() // Безопасное получение элемента
   cloneTemplate() // Клонирование шаблонов
   ```

2. **BEM-помощник:**
   ```typescript
   bem('block', 'element', 'modifier')
   ```

3. **Работа с данными:**
   ```typescript
   setElementData() // Запись в dataset
   getElementData() // Чтение из dataset
   ```
