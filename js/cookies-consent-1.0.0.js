var CookiesConsent = (function () {
  "use strict";

  var userLocation,
    browser,
    globalConfig,
    amcSessionId = getUUID(),
    lgpdCookie = CookiesMonitor.getLgpdCookie(),
    sendingCookie = false,
    categoryToInputID = {
      DESEMPENHO: "#performance",
      // FUNCIONAL: '#functional',
      PUBLICIDADE_MARKETING: "#publicity",
    };

  var sendGAErrors = function (error) {
    window.dataLayer.push({
      event: "gaEventErrors",
      eventCategory: "cookies-consent",
      eventAction: "error",
      eventLabel: error.toString(),
    });
  };

  function getUUID() {
    try {
      return self.crypto.randomUUID();
    } catch (e) {
      console.log("Erro ao obter o UUID. Valor padrão será retornado.");
    }

    return "acadd8a1-7a96-4602-bffa-7f938f17555a";
  }

  if ("geolocation" in navigator) {
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      });
    } catch (e) {
      sendGAErrors(e);
    }
  }

  function setCookie(cname, cvalue) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + 3600 * 1000 * 24 * 365);
      var expires = "expires=" + d.toUTCString();
      document.cookie =
        cname +
        "=" +
        cvalue +
        ";" +
        expires +
        ";Path=/;SameSite=Strict;Secure;";
    } catch (e) {
      sendGAErrors(e);
    }
  }

  var init = function (config) {
    try {
      globalConfig = config || { data: {} };
      CookiesMonitor.includeScript({
        src: globalConfig.basePathAssetsJS + "/browser-detect-1.0.0.js",
        callback: continueInit,
      });
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var continueInit = function () {
    try {
      browser = browserDetect();

      document.querySelectorAll(".js-save-cookies").forEach(function (elem) {
        elem.addEventListener("click", function (e) {
          e.preventDefault();
          acceptOrRefuseCookies();
        });
      });

      document
        .querySelectorAll(".js-accept-cookies--all")
        .forEach(function (elem) {
          elem.addEventListener("click", function (e) {
            e.preventDefault();
            acceptOrRefuseCookies("ACEITO");
          });
        });

      document
        .querySelectorAll(".js-refuse-cookies--all")
        .forEach(function (elem) {
          elem.addEventListener("click", function (e) {
            e.preventDefault();
            acceptOrRefuseCookies("REJEITADO");
          });
        });

      createEvent("CookiesConsentReady");

      if (!CookiesMonitor.getCookie("lgpd-cookie")) {
        createEvent("CookiesConsentShow");

        var cookiesConsentElement = document.querySelector(".aviso-cookies");

        if (cookiesConsentElement) {
          cookiesConsentElement.style.display = "flex";
        }
      }
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var sendCookie = function (data) {
    try {
      sendingCookie = true;

      var amcMessageIdSafraCorrelationId = getUUID();

      data = data || {};

      data.navegador =
        data.navegador ||
        globalConfig.data.navegador ||
        browser.name ||
        "Não identificado";
      data.sistemaOperacional =
        data.sistemaOperacional ||
        globalConfig.data.sistemaOperacional ||
        browser.os ||
        "Não identificado";
      data.dispositivo =
        data.dispositivo || globalConfig.data.dispositivo || "Não identificado";
      data.siteConsentimento =
        data.siteConsentimento || globalConfig.data.siteConsentimento;

      if (userLocation) {
        data.latitude =
          data.latitude || globalConfig.data.latitude || userLocation.latitude;
        data.longitude =
          data.longitude ||
          globalConfig.data.longitude ||
          userLocation.longitude;
      }

      data.lembreMe = data.lembreMe || globalConfig.data.lembreMe;
      data.agencia = data.agencia || globalConfig.data.agencia;
      data.conta = data.conta || globalConfig.data.conta;
      data.documento = data.documento || globalConfig.data.documento;

      var xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        globalConfig.cookiesConsentDomainAPI +
          "/suporte-negocio/gerenciamento-ti/gerenciamento-lgpd/v1/consentimentos-cookies",
        true
      );
      xhr.setRequestHeader(
        "Safra-Correlation-ID",
        amcMessageIdSafraCorrelationId
      );
      xhr.setRequestHeader("Safra-Aplicacao", "PIS");
      xhr.setRequestHeader("amc-session-id", amcSessionId);
      xhr.setRequestHeader("amc-aplicacao", "PIS");
      xhr.setRequestHeader("amc-message-id", amcMessageIdSafraCorrelationId);
      xhr.setRequestHeader("accept-language", "pt-br");
      xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      xhr.send(JSON.stringify(data));

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status <= 299) {
            var id = 1;

            try {
              id = xhr.getResponseHeader("Location");
            } catch (e) {
              console.log(e);
            }

            setCookie("cookieAceitoID", id);
            setCookie("lgpd-cookie", JSON.stringify(lgpdCookie));

            if (window.dataLayer) {
              window.dataLayer.push({
                event: "updateConsentState",
              });
            }

            CookiesMonitor.update();

            createEvent("CookiesConsentAfterSend");

            var cookiesConsentElement =
              document.querySelector(".aviso-cookies");

            if (cookiesConsentElement) {
              cookiesConsentElement.style.display = "none";
            }

            // Tempo para alguma modal fechar completamente
            setTimeout(function () {
              sendingCookie = false;
            }, 1000);
          } else {
            sendError(this.responseText);
          }
        }
      });

      xhr.addEventListener("error", sendError, false);
      xhr.addEventListener("timeout", sendError, false);
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var sendError = function (error) {
    try {
      sendingCookie = false;
      console.log(
        "Ocorreu erro ao realizar o gerenciamento de cookie: " + error
      );
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var checkOrUncheckInput = function (input, status) {
    try {
      if (status === "ACEITO") {
        input.parentElement.classList.add("checkbox-bg-filled");
      } else {
        input.parentElement.classList.remove("checkbox-bg-filled");
      }
      input.checked = status === "ACEITO" ? 1 : 0;
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var acceptOrRefuseCookies = function (status) {
    try {
      if (sendingCookie) {
        return false;
      }

      lgpdCookie.detalhes.forEach(function (detalhe) {
        if (detalhe.categoria !== "ESSENCIAL") {
          if (status) {
            detalhe.status = status;
          } else {
            detalhe.status = document.querySelector(
              "#cookies-management " + categoryToInputID[detalhe.categoria]
            ).checked
              ? "ACEITO"
              : "REJEITADO";
          }
        }
      });

      sendCookie({ detalhes: lgpdCookie.detalhes });
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var cookiesManagement = function () {
    try {
      lgpdCookie.detalhes.forEach(function (detalhe) {
        if (detalhe.categoria !== "ESSENCIAL") {
          checkOrUncheckInput(
            document.querySelector(
              "#cookies-management " + categoryToInputID[detalhe.categoria]
            ),
            detalhe.status
          );
        }
      });

      var modalCookies = document.querySelector("#modal-cookies");

      if (modalCookies) modalCookies.classList.add("loaded");
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var createEvent = function (name) {
    try {
      var event = new Event(name);
      document.dispatchEvent(event);
    } catch (e) {
      sendGAErrors(e);
    }
  };

  return {
    init: init,
    cookiesManagement: cookiesManagement,
    acceptOrRefuseCookies: acceptOrRefuseCookies,
  };
})();
