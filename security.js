import { getCurrentTab } from "./chrome.js";
import { E, T } from "./dom.js";

/**
 *
 * @param {string} url
 * @param {boolean} wk
 * @returns {string} '[/.well-knwon]/security.txt' url
 */
function makeSecurityTxtUrl(url, wk = true) {
    const txtUrl = new URL(url);
    if (wk) {
        txtUrl.pathname = "/.well-known/security.txt";
    } else {

        txtUrl.pathname = "/security.txt";
    }
    txtUrl.search = '';
    txtUrl.hash = '';
    return txtUrl.href;
}

/**
 *
 * @param {string} url
 * @returns {Object} { text: "contents of robots.txt", status: http.status, error: "if error occured." }
 */
async function fetchSecurityTxt(url) {
    try {
        const res = await fetch(url, { headers: { 'Accept': 'text/plain' }, redirect: 'error' });
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
export default async function security() {
    const tab = await getCurrentTab();

    const txtUrl = makeSecurityTxtUrl(tab.url);
    const div = E("div", { id: "security-result" }, E("h2", {}, T("security.txt")), E("p", {}, T(`url: ${txtUrl}`)));
    const result = await fetchSecurityTxt(txtUrl);
    if (result.status && result.status === 200) {
        div.appendChild(E("p", {}, E("a", { href: txtUrl, target: "_blank" }, T("found."))));
        div.appendChild(E("textarea", {}, T(result.text)));
    } else {
        if (result.error) {
            div.appendChild(E("p", {}, T(`${txtUrl} something error. ${result.error}`)));
        } else {
            div.appendChild(E("p", {}, T(`${txtUrl} not found.`)));
        }

        const rootUrl = makeSecurityTxtUrl(tab.url, false);
        const result2 = await fetchSecurityTxt(rootUrl);
        if (result2.status && result2.status === 200) {
            div.appendChild(E("p", {}, E("a", { href: rootUrl, target: "_blank" }, T("found."))));
            div.appendChild(E("textarea", {}, T(result2.text)));
        } else {
            if (result2.error) {
                div.appendChild(E("p", {}, T(`${rootUrl} something error. ${result2.error}`)));
            } else {
                div.appendChild(E("p", {}, T(`${rootUrl} not found.`)));
            }
        }
    }
    return div;
}
