// поле для ввода новой задачи
const addTodoInput = document.querySelector('.add-todo-input');
// кнопка добавления новой задачи
const addTodoButton = document.querySelector('.add-todo-button');
// блок с задачами, куда будет вставляться новая задача
const todoListBlock = document.querySelector('.todo-list-block');


// Список задач
let todoList = [];


// Событие загрузки страницы
window.addEventListener('load', () => {

    loadFromLocalStorage();
    renderTodoBlock();
});

// Событие нажатия на кнопку ADD (добавление задачи)
addTodoButton.addEventListener('click', () => {

    // достаем текст из поля для ввода задачи
    let todoTitle = addTodoInput.value;

    // если текст пустой - игнор
    if (todoTitle.length == 0)
        return;

    // title -> {object}
    let todoObject = createTodoObject(todoTitle);

    // добавляем объект с задачей в массив
    todoList.push(todoObject);

    // {object} => <element/>
    let todoElement = getTodoElement(todoObject);

    // добавить элемент на страницу
    todoListBlock.appendChild(todoElement);

    saveToLocalStorage();
});





// Из объекта todo сделать элемент div
function getTodoElement(todoObject) {

    // редактируется ли блок
    let isEditing = false;

    // Генерируемый блок
    const todoElement = document.createElement('div');

    todoElement.classList.add('todo-block');

    // Если задача выполнена - добавляем класс выполненности
    if (todoObject.isCompleted)
        todoElement.classList.add('todo-completed');

    // Даем специфический аттрибут элементу, айди задачи
    todoElement.setAttribute('todo-id', todoObject.id);

    todoElement.innerHTML = `  
        <div>
            <input type="checkbox" class="todo-checkbox">
            <p class="todo-title">${todoObject.title}</p>
            <input type="text" class="todo-edit-input hidden">
        </div>

        <div>
            <button class="icon-button todo-edit-button">
                <i class="fa-solid fa-pen-to-square" style="color: #5b5b5b;"></i>
            </button>

            <button class="icon-button todo-delete-button">
                <i class="fa-solid fa-trash" style="color: #5b5b5b;"></i>
            </button>
        </div>
    `;

    // Элементы внутри ТЕКУЩЕГО блока todo
    const todoCheckbox = todoElement.querySelector('.todo-checkbox');
    const todoEditButton = todoElement.querySelector('.todo-edit-button');
    const todoDeleteButton = todoElement.querySelector('.todo-delete-button');
    const todoTitleElement = todoElement.querySelector('.todo-title');
    const todoEditInput = todoElement.querySelector('.todo-edit-input');

    // Если задача выполнена - нажимаем на галочку
    if (todoObject.isCompleted)
        todoCheckbox.checked = true;

    // Событие на нажатие удаление задачи
    todoDeleteButton.addEventListener('click', () => {

        // визуально удаляем элемент со страницы
        todoElement.remove();

        // удаляем из массива
        // фильтруем массив и оставляем только те элементы, которые не равны
        // тому, который нужно удалить
        todoList = todoList.filter(item => {
            return item !== todoObject;
        });

        saveToLocalStorage();
    });

    // Событие нажатия на галочку выполнения
    todoCheckbox.addEventListener('click', () => {

        // todoCheckbox.checked - галочка нажата 
        todoObject.isCompleted = todoCheckbox.checked;

        // даем/убираем класс выполнения
        // toggle - если нету класса - даст, если есть - удалит
        todoElement.classList.toggle('todo-completed');

        saveToLocalStorage();
    });

    // Событие нажатия на кнопку редактирования
    todoEditButton.addEventListener('click', () => {

        // true->false, false->true
        isEditing = !isEditing;

        // Если мы включили режим редактирования 
        if (isEditing) {

            // прячем название карточки и показывает инпут для редак
            todoTitleElement.classList.add('hidden');
            todoEditInput.classList.remove('hidden');

            // в появившийся инпут копируем текст задачи
            todoEditInput.value = todoTitleElement.innerText;
        }
        // Если выходим из режима редактирования
        else {

            // прячем инпут и показываем текст
            todoTitleElement.classList.remove('hidden');
            todoEditInput.classList.add('hidden');

            // текст задачи ставим из инпута
            todoTitleElement.innerText = todoEditInput.value;

            // в массиве меняем тайтл
            todoObject.title = todoTitleElement.innerText;

            saveToLocalStorage();
        }
    });

    return todoElement;
}


// показать все задачи из массива
function renderTodoBlock() {

    // убираем список задач с дом дерева
    todoListBlock.innerHTML = '';

    // foreach-ом пробегаемся по массиву задач, генерируем
    // html элементы и вставляем их на страницу

    todoList.forEach(todoObject => {

        // {object} -> <element/>
        let todoElement = getTodoElement(todoObject);

        // внутрь todoListBlock вставляем сгенерированный элемент
        todoListBlock.appendChild(todoElement);
    });
}

// функция принимает название новой задачи и возвращает новый объект с задачей
function createTodoObject(todoTitle) {

    // случайный id
    let todoId = (Math.random() + 1).toString(36).substring(7);

    // генерируем объект
    return {
        id: todoId,
        title: todoTitle,
        isCompleted: false
    };
}

// Сохранить массив задач в localStorage
function saveToLocalStorage() {

    // arr -> json string
    // JSON.stringify = JsonSerializer.Serialize (C#)

    let json = JSON.stringify(todoList);
    localStorage.setItem('todos', json);
}

// загрузить данные в массив из localStorage
function loadFromLocalStorage() {

    // достаем из хранилища 
    let json = localStorage.getItem('todos');

    if(json == null)
        return;

    // json string -> array
    todoList = JSON.parse(json);
}