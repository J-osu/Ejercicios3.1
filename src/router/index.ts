import ScrollTestView from '../view/ScrollTestView.vue'; // Ensure the file exists in the 'views' folder
import WindowSizeDisplay from '../components/WindowSizeDisplay.vue';
import ProgressBarTestView from '../view/ProgressBarTestView.vue';

export const routes = [
  {
    path: '/scroll-test',
    name: 'ScrollTest',
    component: ScrollTestView,
  },
  {
    path: '/window-size',
    name: 'WindowSizeDisplay',
    component: WindowSizeDisplay,
  },
  {
    path: '/progress-test',
    name: 'ProgressBarTest',
    component: ProgressBarTestView, 
  },

];