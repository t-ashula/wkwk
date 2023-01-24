import "./style.css";
import { E, T } from "./dom.js";
import robots from "./robots.js";
import security from "./security";

(async function () {
  const app = document.querySelector('#app');
  app.appendChild(E("h1", {}, T("well known view")));
  const results = await Promise.all([
    robots(),
    security(),
  ]);
  for (const res of results) {
    app.appendChild(res);
  }
})();