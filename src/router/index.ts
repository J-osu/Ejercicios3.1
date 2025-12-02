import ScrollTestView from '../view/ScrollTestView.vue'; // Ensure the file exists in the 'views' folder
import WindowSizeDisplay from '../components/WindowSizeDisplay.vue';
import ProgressBarTestView from '../view/ProgressBarTestView.vue';
import UnsavedChangesForm from '../components/UnsavedChangesForm.vue';
import InfinityScrollList from '../components/InfinityScrollList.vue';
import DropDownMenu from '../components/DropDownMenu.vue';
import FullscreenWrapper from '../components/FullscreenWrapper.vue';

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
  {
  path: '/formulario',
  name: 'UnsavedChangedForm',
  component: UnsavedChangesForm
  },
  {
    path: '/pokemon',
    name: 'InfinityScrollList',
    component: InfinityScrollList
  },
  {
    path: '/dropdown',
    name: 'DropDownMenu',
    component: DropDownMenu
  },
  {
    path: '/fullscreenwrapper',
    name: 'FullScreenWrapper',
    component: FullscreenWrapper
  }

];