window.tiContent = function () {
    if (!window.__tiContent) {
        window.__tiContent = fetch("/api/content", { headers: { "Accept": "application/json" } })
            .then(function (response) { return response.ok ? response.json() : null; })
            .catch(function () { return null; });
    }
    return window.__tiContent;
};
