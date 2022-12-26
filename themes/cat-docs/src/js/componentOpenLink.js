export function setup() {
    const extLinks = document.querySelectorAll('a.external');
    if (extLinks) {
        extLinks.forEach((link) => {
            link.setAttribute('target', '_blank');
        });
    }
}
