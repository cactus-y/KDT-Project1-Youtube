// when the whole DOM elements are loaded, set the toggle button
function initNavbarToggleButton() {
    const toggleButton = document.getElementById("sidebarToggle");
    const body = document.body;

    toggleButton.addEventListener("click", () => {
        const pageID = body.id;

        // navbar's toggle button works differently
        if (pageID === "page-main") {
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("collapsed");
        } else if (pageID === "page-video") {
            const modal = new bootstrap.Modal(document.getElementById(''))
        }
    });
}

document.addEventListener('DOMContentLoaded', initNavbarToggleButton)