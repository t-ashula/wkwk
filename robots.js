import { getCurrentTab } from "./chrome.js";
import { E, T } from "./dom.js";

/**
 *
 * @param {string} url
 * @returns {string} '/robots.txt' url
 */
function makeRobotsUrl(url) {
    const robotsUrl = new URL(url);
    robotsUrl.pathname = "/robots.txt";
    robotsUrl.search = '';
    robotsUrl.hash = '';
    return robotsUrl.href;
}

/**
 *
 * @param {string} url
 * @returns {Object} { text: "contents of robots.txt", status: http.status, error: "if error occured." }
 */
async function fetchRobotsTxt(url) {
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
export default async function robots() {
    const tab = await getCurrentTab();
    const robotsUrl = makeRobotsUrl(tab.url);
    const div = E("div", { id: "robots-result" }, E("h2", {}, T("robots.txt")), E("p", {}, T(`url: ${robotsUrl}`)));
    const result = await fetchRobotsTxt(robotsUrl);
    if (result.status) {
        if (result.status === 200) {
            div.appendChild(E("p", {}, E("a", { href: robotsUrl, target: "_blank" }, T("found."))));
            div.appendChild(E("textarea", {}, T(result.text)));
        } else {
            div.appendChild(E("p", {}, T(`not found. ${result.status}`)));
        }
    } else {
        div.appendChild(T(`something error :${result.error}`))
    }
    return div;
}
