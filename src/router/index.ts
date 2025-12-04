import ScrollTestView from '../view/ScrollTestView.vue'; // Ensure the file exists in the 'views' folder
import WindowSizeDisplay from '../components/WindowSizeDisplay.vue';
import ProgressBarTestView from '../view/ProgressBarTestView.vue';
import UrlInspectorTestView from '../view/UrlInspectorTestView.vue';
import NavigationTestView from '../view/NavigationTestView.vue';
import SmartRedirectorTestView from '../view/SmartRedirectorTestView.vue';
import LanguageRedirectTestView from '../view/LanguageRedirectTestView.vue';
import UnsavedChangesForm from '../components/UnsavedChangesForm.vue';
import InfinityScrollList from '../components/InfinityScrollList.vue';
import DropDownMenu from '../components/DropDownMenu.vue';
import FullscreenWrapper from '../components/FullscreenWrapper.vue';
import PopupWindowManager from '../components/PopupWindowManager.vue';
import SearchFilter from '../components/SearchFilter.vue';
import ProductPrice from '../components/ProductPrice.vue';
import CountdownTimer from '../view/Countdown.vue';
import CalendarView from '../view/CalendarView.vue';
import HistoryControls from '../components/HistoryControls.vue';
import TabNavigator from '../components/TabNavigator.vue';

export const routes = [
  {
    path: '/',
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
    path: '/url-inspector',
    name: 'UrlInspectorTest',
    component: UrlInspectorTestView,
  },
  {
    path: '/navigation-test',
    name: 'NavigationTest',
    component: NavigationTestView,
  },
  {
  path: '/redirector-test',
  name: 'RedirectorTest',
  component: SmartRedirectorTestView, 
  },
  { path: '/pagina-para-firefox', component: { template: '<h1>Bienvenido, usuario de Firefox!</h1>' } },
  { path: '/pagina-para-chrome', component: { template: '<h1>Bienvenido, usuario de Chrome!</h1>' } },
  {
  path: '/lang-test',
  name: 'LanguageRedirectTest',
  component: LanguageRedirectTestView, 
},
{ path: '/lang-en.html', component: { template: '<h1>Página de Destino: Inglés</h1>' } },
{ path: '/lang-es.html', component: { template: '<h1>Página de Destino: Español</h1>' } },
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
},
{
  path: '/formulario',
  name: 'UnsavedChangedForm',
  component: UnsavedChangesForm
  },
  {
    path: '/popup',
    name: 'PopupWindow',
    component: PopupWindowManager
  },
  {
    path:'/search',
    name: 'search',
    component: SearchFilter
  },
  {
    path:'/products',
    name: 'products',
    component: ProductPrice
  },
  {
    path: '/countdown',
    name: 'countdown',
    component: CountdownTimer
  },
  {
    path: '/calendario',
    name: 'calendario',
    component: CalendarView
  },
  {
    path: '/manejo',
    name: 'manejo',
    component: HistoryControls
  },
  {
    path: '/tab',
    name: 'tab',
    component: TabNavigator
  }


];