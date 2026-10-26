(function () {
    var PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.tiappstudio.tts";

    var playIcon =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path fill="#34A853" d="M3.5 20.7 13.2 12 3.5 3.3c-.3.4-.5.9-.5 1.5v14.4c0 .6.2 1.1.5 1.5z"/>' +
            '<path fill="#FBBC04" d="m16.4 15.2-3.2-3.2-9.7 8.7c.4.5 1 .8 1.7.8.5 0 1-.1 1.4-.4l9.8-5.9z"/>' +
            '<path fill="#EA4335" d="M20.3 10.6 16.4 8.8 13.2 12l3.2 3.2 3.9-2.3c.8-.5.8-1.8 0-2.3z"/>' +
            '<path fill="#4285F4" d="M4.7 2.7C4.3 3 4 3.5 4 4.1l9.2 7.9 3.2-3.2L4.7 2.7z"/>' +
        "</svg>";

    document.querySelectorAll("[data-play-store]").forEach(function (link) {
        link.href = PLAY_STORE_URL;
    });

    var root = document.querySelector("[data-game-list]");
    if (!root) return;

    var games = [
        {
            no: "01",
            name: "Titan Soccer",
            kind: "Futbol",
            href: "./titan-soccer.html",
            logo: "./images/ttslogo1.png",
            summary: "Titan Soccer, kişisel bir 2D kariyer geliştirme oyunudur. Kendi oyuncunla sahaya çıkar, maç maç ilerler ve sezon boyunca becerilerini geliştirirsin. Odak kalabalık bir kadroda değil, sana ait tek bir futbol yolundadır."
        }
    ];

    root.innerHTML = games.map(function (game) {
        return (
            '<div class="game-tab">' +
                '<a class="game-tab-hit" href="' + game.href + '">' +
                    '<div class="game-tab-bar">' +
                        '<img class="game-logo" src="' + game.logo + '" alt="">' +
                        '<span class="game-tab-copy">' +
                            '<span class="game-tab-title">' + game.name + "</span>" +
                            '<span class="game-tab-kind">' + game.kind + "</span>" +
                        "</span>" +
                    "</div>" +
                    '<div class="game-tab-reveal">' +
                        '<div class="game-tab-reveal-inner">' +
                            '<p class="game-tab-detail">' + game.summary + "</p>" +
                        "</div>" +
                    "</div>" +
                "</a>" +
                '<a class="btn btn-store btn-store-sm" href="' + PLAY_STORE_URL + '" target="_blank" rel="noopener noreferrer">' +
                    playIcon + "Play Store" +
                "</a>" +
            "</div>"
        );
    }).join("");
})();
