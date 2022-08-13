import './style.scss';
import {UI} from './components/ui.js';
import {controller} from './components/mvc/mvc.js';


controller.loadFromLocalStorage();

UI.page.refreshDashboard();
UI.staticEventListeners();
