import "./style.css";
import { E, T } from "./dom.js";
import robots from "./robots.js";

(async function () {
  const app = document.querySelector('#app');
  app.appendChild(E("h1", {}, T("well known view")));
  const results = await Promise.all([
    robots()
  ]);
  for (const res of results) {
    app.appendChild(res);
  }
})();