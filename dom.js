function E(tag, attrs, ...children) {
    const ele = document.createElement(tag);
    if (attrs && Object.keys(attrs) > 0) {
        for (const aName of Object.keys(attrs)) {
            ele.setAttribute(aName, attrs[aName]);
        }
    }

    if (children && children.length > 0) {
        for (const child of children) {
            ele.appendChild(child);
        }
    }
    return ele;
}

function T(content) {
    return document.createTextNode(content);
}

export { E, T };