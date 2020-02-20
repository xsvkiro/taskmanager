import FilterComponent from "./components/filter.js";
import TaskComponent from "./components/create-task.js";
import SiteMenuComponent from "./components/menu.js";
import BoardComponent from "./components/board.js";
import LoadMoreButtonComponent from "./components/button.js";
import {renderElement, RenderPosition} from "./components/render.js";
import TaskEditComponent from "./components/edit-task";
import {generateTasks} from "./mocks/task.js";
import {generateFilters} from "./components/filter.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  renderElement(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
renderElement(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
renderElement(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);

const tasks = generateTasks(TASK_COUNT);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(0, showingTasksCount).forEach((task) => renderTask(task));

const loadMoreButton = new LoadMoreButtonComponent();
renderElement(boardComponent.getElement(), loadMoreButton.getElement(), RenderPosition.BEFOREEND);

loadMoreButton.getElement().addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTask(task));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.getElement().remove();
    loadMoreButton.removeElement();
  }
});
