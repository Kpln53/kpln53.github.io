(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            toggle.textContent = window.tiText ? window.tiText(open ? "nav.close" : "nav.menu") : (open ? "Kapat" : "Menü");
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.textContent = window.tiText ? window.tiText("nav.menu") : "Menü";
            });
        });
    }

    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());

    var studioMail = "support@tiappstudio.com";
    if (window.tiContent) {
        window.tiContent().then(function (data) {
            if (data && data.site && data.site.email) studioMail = data.site.email;
        });
    }

    function showOpening(status) {
        if (!status) return;
        var opening = window.tiText ? window.tiText("contact.opening") : "E-posta uygulamanız açılıyor. Açılmazsa şu adrese yazabilirsiniz:";
        status.textContent = opening + " " + studioMail;
        status.classList.add("is-visible");
    }

    function openMail(subject, body) {
        window.location.href = "mailto:" + studioMail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }

    var form = document.querySelector("#contact-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var data = new FormData(form);
            var name = String(data.get("name") || "").trim();
            var email = String(data.get("email") || "").trim();
            var topic = String(data.get("topic") || "").trim();
            var message = String(data.get("message") || "").trim();
            showOpening(document.querySelector("#form-status"));
            openMail("Ti App Studio — " + topic, message + "\n\n— " + name + "\n" + email);
        });
    }

    var jobOpen = document.querySelector("[data-job-open]");
    var jobDialog = document.querySelector("#job-dialog");
    if (jobOpen && jobDialog) {
        jobOpen.addEventListener("click", function () {
            jobDialog.showModal();
            var first = jobDialog.querySelector("input");
            if (first) first.focus();
        });
        jobDialog.querySelector("[data-job-close]").addEventListener("click", function () {
            jobDialog.close();
        });
        jobDialog.addEventListener("click", function (event) {
            var rect = jobDialog.getBoundingClientRect();
            var inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
            if (!inside) jobDialog.close();
        });
    }

    var job = document.querySelector("#job-form");
    if (job) {
        job.addEventListener("submit", function (event) {
            event.preventDefault();
            var data = new FormData(job);
            var name = String(data.get("name") || "").trim();
            var email = String(data.get("email") || "").trim();
            var role = String(data.get("role") || "").trim();
            var link = String(data.get("link") || "").trim();
            var message = String(data.get("message") || "").trim();
            var roleLabel = window.tiText ? window.tiText("job.role") : "Ne yapmak istiyorsun";
            var linkLabel = window.tiText ? window.tiText("job.link") : "Portfolyo";
            var subjectName = window.tiText ? window.tiText("job.subject") : "İş başvurusu";
            var lines = [roleLabel + ": " + role];
            if (link) lines.push(linkLabel + ": " + link);
            lines.push("", message, "", "— " + name, email);
            showOpening(document.querySelector("#job-status"));
            openMail("Ti App Studio — " + subjectName, lines.join("\n"));
        });
    }
})();
