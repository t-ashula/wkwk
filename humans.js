import { getCurrentTab } from "./chrome.js";
import { E, T } from "./dom.js";

/**
 *
 * @param {string} url
 * @returns {string} '/humans.txt' url
 */
function makeHumansUrl(url) {
    const humansUrl = new URL(url);
    humansUrl.pathname = "/humans.txt";
    humansUrl.search = '';
    humansUrl.hash = '';
    return humansUrl.href;
}

/**
 *
 * @param {string} url
 * @returns {Object} { text: "contents of humans.txt", status: http.status, error: "if error occured." }
 */
async function fetchHumansTxt(url) {
    try {
        const res = await fetch(url, { headers: { 'Accept': 'text/plain' } });
        if (res) {
            const text = await res.text();
            return { status: res.status, text: text };
        } else {
            return { error: `fetch failed. [url=${url}, error="no response"]` };
        }
    } catch (err) {
        return { error: `exception raised. [url=${url}, error="${err}"]` };
    }
}

/**
 *
 */
export default async function humans() {
    const tab = await getCurrentTab();
    const humansUrl = makeHumansUrl(tab.url);
    const div = E("div", { id: "humans-result" }, E("h2", {}, T("humans.txt")), E("p", {}, T(`url: ${humansUrl}`)));
    const result = await fetchHumansTxt(humansUrl);
    if (result.status) {
        if (result.status === 200) {
            div.appendChild(E("p", {}, E("a", { href: humansUrl, target: "_blank" }, T("found."))));
            div.appendChild(E("textarea", {}, T(result.text)));
        } else {
            div.appendChild(E("p", {}, T(`not found. ${result.status}`)));
        }
    } else {
        div.appendChild(T(`something error :${result.error}`))
    }
    return div;
}
