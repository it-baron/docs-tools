const HTML = '';

export function setup() {
    const newElement = document.createElement('div');
    newElement.className = 'note admonition';
    newElement.innerHTML = HTML;

    let tag = document.getElementsByTagName('h1')[0];
    if (!tag) { return; }

    let mode = 'afterend';
    let next = tag.nextElementSibling;
    if (next && next.id === 'on-this-page') {
        tag = next;
        next = tag.nextElementSibling;
    }

    if (next.querySelector('dl dt .descname') !== null) {
        mode = 'afterbegin';
        tag = next.querySelector('dl dd');
    }

    tag.insertAdjacentElement(mode, newElement);
}
