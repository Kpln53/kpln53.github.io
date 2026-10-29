(function () {
    var googleIcon =
        '<svg viewBox="0 0 48 48" aria-hidden="true">' +
            '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>' +
            '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>' +
            '<path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>' +
            '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.7 7.1l6.3 5.3C37.4 38.4 44 33 44 24c0-1.3-.1-2.7-.4-3.5z"/>' +
        "</svg>";

    function status(form, text, isError) {
        var el = form.querySelector(".form-status");
        if (!el) return;
        el.textContent = text;
        el.classList.add("is-visible");
        el.classList.toggle("is-error", !!isError);
    }

    function goHome() {
        window.location.assign("./index.html");
    }

    var login = document.querySelector("#login-form");
    if (login) {
        login.addEventListener("submit", function (event) {
            event.preventDefault();
            var data = new FormData(login);
            var button = login.querySelector("button");
            button.disabled = true;
            fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    email: String(data.get("email") || ""),
                    password: String(data.get("password") || "")
                })
            }).then(function (response) {
                if (!response.ok) throw new Error("denied");
                goHome();
            }).catch(function () {
                button.disabled = false;
                status(login, window.tiText ? window.tiText("auth.bad") : "E-posta veya şifre yanlış.", true);
            });
        });
    }

    var register = document.querySelector("#register-form");
    if (register) {
        register.addEventListener("submit", function (event) {
            event.preventDefault();
            var data = new FormData(register);
            var button = register.querySelector("button");
            button.disabled = true;
            fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: String(data.get("name") || ""),
                    email: String(data.get("email") || ""),
                    password: String(data.get("password") || "")
                })
            }).then(function (response) {
                if (response.status === 409) throw new Error("exists");
                if (!response.ok) throw new Error("invalid");
                goHome();
            }).catch(function (error) {
                button.disabled = false;
                status(register, window.tiText ? window.tiText(error.message === "exists" ? "auth.exists" : "auth.invalid") : "Ad, e-posta ve en az 8 karakterlik bir şifre gerekli.", true);
            });
        });
    }

    var googleButton = document.querySelector("[data-google]");
    if (!googleButton) return;

    function failGoogle() {
        var form = document.querySelector("#login-form, #register-form");
        if (form) status(form, window.tiText ? window.tiText("auth.googleOff") : "Google girişi şu an bağlanmadı.", true);
    }

    function paintGoogle() {
        googleButton.innerHTML = googleIcon + (window.tiText ? window.tiText("auth.google") : "Google ile devam et");
    }

    paintGoogle();
    document.addEventListener("ti-lang", function () {
        if (!googleButton.hidden) paintGoogle();
    });
    googleButton.addEventListener("click", failGoogle);

    fetch("/api/config", { headers: { "Accept": "application/json" } })
        .then(function (response) { return response.ok ? response.json() : {}; })
        .then(function (config) {
            if (!config.googleClientId) return;
            var script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.onload = function () {
                googleButton.hidden = true;
                google.accounts.id.initialize({
                    client_id: config.googleClientId,
                    callback: function (response) {
                        fetch("/api/login/google", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({ credential: response.credential })
                        }).then(function (result) {
                            if (!result.ok) throw new Error("denied");
                            goHome();
                        }).catch(failGoogle);
                    }
                });
                google.accounts.id.renderButton(document.querySelector("[data-google-slot]"), {
                    theme: "filled_black",
                    size: "large",
                    text: "continue_with",
                    shape: "pill",
                    width: 392
                });
            };
            document.head.appendChild(script);
        })
        .catch(function () {});
})();
