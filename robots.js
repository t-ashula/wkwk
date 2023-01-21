import { getCurrentTab } from "./chrome.js";
import { E, T } from "./dom.js";

/**
 * 
 */
export default async function robots() {
    const tab = await getCurrentTab();
    const div = E("div", { id: "robots-result" }, E("h2", {}, T("robots.txt")), E("p", {}, T(`url: ${tab.url}`)));
    try {
        const robotsUrl = new URL(tab.url);
        robotsUrl.pathname = "/robots.txt";
        const res = await fetch(robotsUrl.href);
        if (res) {
            if (res.status === 200) {

                const text = await res.text();
                div.appendChild(E("p", {}, E("a", { href: robotsUrl.href }, T("found."))));
                div.appendChild(E("textarea", {}, T(text)));

            } else {
                div.appendChild(E("p", {}, T(`not found. ${res.status}`)));
            }
        } else {
            div.appendChild(T("something error"));
        }
    } catch (e) {
        div.appendChild(T(`something error :${e}, ${JSON.stringify(tab)}`))
    }
    return div;
}