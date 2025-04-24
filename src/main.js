import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./assets/main.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Font Awesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// Add the icons to the library
library.add(faMoon, faSun);

const app = createApp(App);

app.use(Toast);
app.use(createPinia());
app.use(router);

// Register the font-awesome-icon globally
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
