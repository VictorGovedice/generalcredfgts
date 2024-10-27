var ConsentimentoCookies = (function () {
    'use strict';
    var getUUID = function () {
        try {
            return self.crypto.randomUUID();
        }
        catch (e) {
            console.log('Erro ao obter o UUID. Valor padrÃ£o serÃ¡ retornado.');
        }
        return 'acadd8a1-7a96-4602-bffa-7f938f17555a';
    };
    var getLgpdCookie = function () {
        var lgpdCookie = getCookie('lgpd-cookie'), defaultAcceptOrRefuse = (getCookie('cookieAceitoID') && !lgpdCookie) ? 'ACEITO' : 'REJEITADO';
        var lgpdCookieDefault = {
            "version": "1.0.0",
            "detalhes": [{
                    "categoria": "ESSENCIAL",
                    "status": "ACEITO",
                    "cookies": [
                        {
                            "criador": "Akamai",
                            "itens": [
                                "ak_bmsc",
                                "bm_sv"
                            ]
                        },
                        {
                            "criador": "AWS",
                            "itens": [
                                "AWSALB",
                                "AWSALBCORS"
                            ]
                        },
                        {
                            "criador": "Safra",
                            "itens": [
                                "cookieAceitoID",
                                "pagina404CentralDeConteudo",
                                "lgpd-cookie"
                            ]
                        },
                        {
                            "criador": "LumisXP",
                            "itens": [
                                "JSESSIONID",
                                "lumClientId",
                                "lumIsLoggedUser",
                                "lumMonUid",
                                "lumUserLocale",
                                "lumUserName",
                                "lumUserSessionId"
                            ]
                        }
                    ]
                }, {
                    "categoria": "DESEMPENHO",
                    "status": defaultAcceptOrRefuse,
                    "cookies": [
                        {
                            "criador": "Google",
                            "itens": [
                                "_ga",
                                "_gid",
                                "_gac_UA-145951529-1",
                                "_gat_UA-145951529-1"
                            ]
                        }
                    ]
                }, {
                    "categoria": "PUBLICIDADE_MARKETING",
                    "status": defaultAcceptOrRefuse,
                    "cookies": [
                        {
                            "criador": "Google",
                            "itens": [
                                "__Secure-1PAPISID",
                                "__Secure-1PSID",
                                "__Secure-1PSIDCC",
                                "__Secure-3PAPISID",
                                "__Secure-3PSID",
                                "__Secure-3PSIDCC",
                                "_gcl_au",
                                "_gcl_aw",
                                "1P_JAR",
                                "AEC",
                                "AID",
                                "ANID",
                                "APISID",
                                "DSID",
                                "HSID",
                                "IDE",
                                "NID",
                                "OTZ",
                                "SAPISID",
                                "SEARCH_SAMESITE",
                                "SID",
                                "SIDCC",
                                "SSID"
                            ]
                        },
                        {
                            "criador": "Bing",
                            "itens": [
                                "MR",
                                "MUID",
                                "SRCHD",
                                "SRCHHPGUSR",
                                "SRCHUID",
                                "SRCHUSR",
                                "SRM_B",
                                "SRM_I"
                            ]
                        },
                        {
                            "criador": "Clarity",
                            "itens": [
                                "_clck",
                                "_clsk",
                                "ANONCHK",
                                "CLID",
                                "MR",
                                "MUID",
                                "SM"
                            ]
                        },
                        {
                            "criador": "Facebook",
                            "itens": [
                                "_fbp",
                                "datr",
                                "fr",
                                "sb"
                            ]
                        },
                        {
                            "criador": "Linkedin",
                            "itens": [
                                "AnalyticsSyncHistory",
                                "bcookie",
                                "lang",
                                "li_sugr",
                                "lidc",
                                "UserMatchHistory"
                            ]
                        },
                        {
                            "criador": "Lotame",
                            "itens": [
                                "_cc_id"
                            ]
                        },
                        {
                            "criador": "Oracle Responsys",
                            "itens": [
                                "PS_DEVICEFEATURES"
                            ]
                        },
                        {
                            "criador": "Taboola",
                            "itens": [
                                "t_gid"
                            ]
                        }
                    ]
                }]
        };
        if (!getCookie('cookieAceitoID')) {
            return lgpdCookieDefault;
        }
        try {
            return JSON.parse(lgpdCookie);
        }
        catch (e) { }
        return lgpdCookieDefault;
    };
    var userLocation, browser, globalConfig, amcSessionId = getUUID(), lgpdCookie = getLgpdCookie(), sendingCookie = false;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userLocation = {
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude
            };
        });
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function setCookie(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (3600 * 1000 * 24 * 365));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    function getCookieList() {
        var cookies = document.cookie.split(';');
        return cookies.map(function (e) {
            return e.split('=')[0].trim();
        });
    }
    var init = function (config) {
        globalConfig = config || { data: {} };
        (function (d, s) {
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
            j.async = true;
            j.defer = true;
            j.src = globalConfig.basePathAssetsJS + '/browser-detect-1.0.0.min.js';
            j.onload = continueInit;
            f.parentNode.insertBefore(j, f);
        })(document, 'script');
    };
    var continueInit = function () {
        browser = browserDetect();
        document.querySelectorAll('.js-save-cookies').forEach(function (elem) {
            elem.addEventListener('click', function () {
                acceptOrRefuseCookies();
            });
        });
        document.querySelectorAll('.js-accept-cookies--all').forEach(function (elem) {
            elem.addEventListener('click', function () {
                acceptOrRefuseCookies('ACEITO');
            });
        });
        document.querySelectorAll('.js-refuse-cookies--all').forEach(function (elem) {
            elem.addEventListener('click', function () {
                acceptOrRefuseCookies('REJEITADO');
            });
        });
    };
    var sendCookie = function (data) {
        sendingCookie = true;
        var amcMessageIdSafraCorrelationId = getUUID();
        data = data || {};
        data.navegador = data.navegador || globalConfig.data.navegador || browser.name;
        data.sistemaOperacional = data.sistemaOperacional || globalConfig.data.sistemaOperacional || browser.os;
        data.dispositivo = data.dispositivo || globalConfig.data.dispositivo || 'NÃ£o identificado';
        data.siteConsentimento = data.siteConsentimento || globalConfig.data.siteConsentimento;
        if (userLocation) {
            data.latitude = data.latitude || globalConfig.data.latitude || userLocation.latitude;
            data.longitude = data.longitude || globalConfig.data.longitude || userLocation.longitude;
        }
        data.lembreMe = data.lembreMe || globalConfig.data.lembreMe;
        data.agencia = data.agencia || globalConfig.data.agencia;
        data.conta = data.conta || globalConfig.data.conta;
        data.documento = data.documento || globalConfig.data.documento;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", globalConfig.domainAPI + "/suporte-negocio/gerenciamento-ti/gerenciamento-lgpd/v1/consentimentos-cookies", true);
        xhr.setRequestHeader("Safra-Correlation-ID", amcMessageIdSafraCorrelationId);
        xhr.setRequestHeader("Safra-Aplicacao", "PIS");
        xhr.setRequestHeader("amc-session-id", amcSessionId);
        xhr.setRequestHeader("amc-aplicacao", "PIS");
        xhr.setRequestHeader("amc-message-id", amcMessageIdSafraCorrelationId);
        xhr.setRequestHeader("accept-language", "pt-br");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send(JSON.stringify(data));
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 && (this.status >= 200 && this.status <= 299)) {
                var id = 1;
                try {
                    id = xhr.getResponseHeader('Location');
                }
                catch (e) {
                    console.log(e);
                }
                setCookie('cookieAceitoID', id);
                setCookie('lgpd-cookie', JSON.stringify(lgpdCookie));
                window.dataLayer = window.dataLayer || [];
                if (window.dataLayer) {
                    window.dataLayer.push({
                        'event': 'updateConsentState'
                    });
                }
                if (typeof globalConfig.callbackAfterSendCookie === 'function') {
                    globalConfig.callbackAfterSendCookie();
                }
                // Tempo para modal fechar completamente
                setTimeout(function () {
                    sendingCookie = false;
                }, 1000);
            }
        });
        xhr.addEventListener("error", sendError, false);
        xhr.addEventListener("timeout", sendError, false);
    };
    var sendError = function () {
        console.log('Ocorreu erro ao enviar o aceite do cookie.');
    };
    var checkOrUncheckInput = function (input, status) {
        if (status === 'ACEITO') {
            input.parentElement.classList.add('checkbox-bg-filled');
        }
        else {
            input.parentElement.classList.remove('checkbox-bg-filled');
        }
        input.checked = (status === 'ACEITO') ? 1 : 0;
    };
    var acceptOrRefuseCookies = function (status) {
        if (sendingCookie) {
            return false;
        }
        document.querySelector('.aviso-cookies').style.display = 'none';
        if (status !== undefined) {
            checkOrUncheckInput(document.querySelector('#cookies-management #performance'), status);
            checkOrUncheckInput(document.querySelector('#cookies-management #publicity'), status);
        }
        lgpdCookie.detalhes.forEach(function (detalhe) {
            if (detalhe.categoria === 'DESEMPENHO') {
                acceptOrRefuseCookieGroup(detalhe, '#performance');
            }
            else if (detalhe.categoria === 'PUBLICIDADE_MARKETING') {
                acceptOrRefuseCookieGroup(detalhe, '#publicity');
            }
        });
        sendCookie({ detalhes: lgpdCookie.detalhes });
    };
    var acceptOrRefuseCookieGroup = function (detalhe, input) {
        var status = document.querySelector('#cookies-management ' + input).checked ? 'ACEITO' : 'REJEITADO', cookieList = getCookieList();
        detalhe.status = status;
        // Confirmar questÃ£o do GA, pois se ele vai ser sempre executado, nÃ£o pode apagar o cookie de desempenho
        if (detalhe.categoria === 'PUBLICIDADE_MARKETING') {
            detalhe.cookies.forEach(function (cookie) {
                cookie.itens.forEach(function (item) {
                    if (cookieList.indexOf(item) !== -1 && status === 'REJEITADO') {
                        deleteCookie(item);
                    }
                });
            });
        }
    };
    var cookiesManagement = function () {
        lgpdCookie.detalhes.forEach(function (detalhe) {
            if (detalhe.categoria === 'DESEMPENHO') {
                checkOrUncheckInput(document.querySelector('#cookies-management #performance'), detalhe.status);
            }
            else if (detalhe.categoria === 'PUBLICIDADE_MARKETING') {
                checkOrUncheckInput(document.querySelector('#cookies-management #publicity'), detalhe.status);
            }
        });
        document.querySelector('#modal-cookies').classList.add('loaded');
    };
    var ready = function () {
        var event = new Event('CookiesConsentReady');
        document.dispatchEvent(event);
    };
    return {
        ready: ready,
        init: init,
        sendCookie: sendCookie,
        cookiesManagement: cookiesManagement
    };
})();
ConsentimentoCookies.ready();
