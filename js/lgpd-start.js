(function () {
    // "use strict";


    // Script de Segurança da informação para monitoramento de sites Safra
    if (location.hostname === "www.safrafinanceira.com.br") {
        const i = new Image(1, 1);
        i.src = "https://s3-sa-east-1.amazonaws.com/frame-image-br/bg.png?x-id=SFR&x-r=" + document.referrer;
    }

    // Evitar erro se não houver GTM/GA na página
    window.dataLayer = window.dataLayer || [];


    function includeScript(config) {
        var f = document.getElementsByTagName("script")[0],
            j = document.createElement("script");
        j.async = config.async || true;
        j.defer = config.defer || true;
        j.src = config.src;
        j.onload = config.callback;
        f.parentNode.insertBefore(j, f);
    }

    function showTab() {
        const classTabContent = {
            "cookies-usados-tab": "isFormCookies",
            "politica-cookies-tab": "isInfoCookies"
        }
        const navLinks = document.querySelectorAll("a.nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    const classTabToHidden = classTabContent[link.getAttribute("id")]
                    document.querySelector(`.${classTabToHidden}`).style.display = "none"
                });
                link.classList.add("active");
                const classTabToShoww = classTabContent[link.getAttribute("id")]
                document.querySelector(`.${classTabToShoww}`).style.display = "block"
            });
        });
    }

    try {
        // var basePath = "/lumis-theme/br/com/safra/financeira/theme/safra-financeira/scripts/components/cookies",
        // var basePath = "./scripts/components/cookies",
        // version = "1.1.3";

        // API de monitoramento de Cookies
        includeScript({
            src: "/lumis-theme/br/com/safra/financeira/theme/safra-financeira/scripts/components/cookies/cookies-monitor-1.0.0.js?ver=1.1.3",
            callback: function () {
                CookiesMonitor.init({
                    cookiesConsentDomainAPI:
                        location.hostname === "www.safrafinanceira.com.br"
                            ? "https://api.safra.com.br"
                            : "https://api-hml.safra.com.br",
                    basePathAssetsJS: "/lumis-theme/br/com/safra/financeira/theme/safra-financeira/scripts/components/cookies",
                    cookiesConsentFileJS: "/cookies-consent-1.0.0.js?ver=1.1.3",
                    categorizedCookiesJsonURL: "/cookies-categorized.json?ver=1.1.3",
                    data: {
                        siteConsentimento: "www.safrafinanceira.com.br",
                    },
                });
            },
        });

        showTab()

        document.addEventListener("CookiesMonitorOpenManagement", function () {
            document.querySelector("#modal-cookies").style.display = "block"
        });

        document.addEventListener("CookiesConsentAfterSend", function () {
            document.querySelector("#modal-cookies").style.display = "none"
        });

        // Fecha modal quando clica no ícone x.
        document.querySelector("button.close.btn-modal-close").addEventListener("click", () => {
            document.querySelector("#modal-cookies").style.display = "none"
        })

        // Fecha modal quando clica em qualquer área fora do modal.
        document.querySelector("#modal-cookies").addEventListener("click", (event) => {
            if (event.target === document.querySelector("#modal-cookies")) {
                document.querySelector("#modal-cookies").style.display = "none"
            }
        })


    } catch (error) {
        console.log(error);
    }
})();