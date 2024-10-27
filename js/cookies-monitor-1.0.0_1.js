var CookiesMonitor = (function () {
  "use strict";

  var sendGAErrors = function (error) {
    window.dataLayer.push({
      event: "gaEventErrors",
      eventCategory: "cookies-monitor",
      eventAction: "error",
      eventLabel: error.toString(),
    });
  };

  var getDomain = function () {
    try {
      return location.hostname.split(".").slice(-3).join(".");
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var lgpdCookie,
    lgpdCookieIsDefault = true,
    globalConfig,
    cookieConsentLoading = false,
    domainTopCookie = getDomain();

  var lgpdCookieOptimzedForSearch = {
    complete: {},
    part: [],
  };

  var init = function (config) {
    try {
      globalConfig = config || { data: {} };
      initLgpdCookie();
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var includeScript = function (config) {
    try {
      var f = document.getElementsByTagName("script")[0],
        j = document.createElement("script");
      j.async = config.async || true;
      j.defer = config.defer || true;
      j.src = config.src;
      j.onload = config.callback;
      f.parentNode.insertBefore(j, f);
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var getCookie = function (cName) {
    try {
      var name = cName + "=";
      var cDecoded = decodeURIComponent(document.cookie);
      var cArr = cDecoded.split("; ");
      var res;
      cArr.forEach(function (val) {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
      });
      return res;
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var getCookieList = function () {
    try {
      var cookies = document.cookie.split(";");
      return cookies.map(function (e) {
        return e.split("=")[0].trim();
      });
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var deleteCookie = function (name, type) {
    try {
      // TODO: Aplicar regra de remoção para localStorage e sessionStorage depois de analisar possíveis problemas
      if (type === "cookies") {
        console.log("Cookie deletado: " + name);
        document.cookie =
          name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          name +
          "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=" +
          domainTopCookie;
      }
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var getLgpdCookie = function () {
    try {
      return lgpdCookie;
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var initLgpdCookie = function () {
    try {
      lgpdCookie = JSON.parse(getCookie("lgpd-cookie"));
      lgpdCookieIsDefault = false;
      identifyCookies();
    } catch (e) {
      lgpdCookieDefault();
    }
  };

  var sendError = function (error) {
    console.log(
      "Ocorreu erro ao realizar o monitoramento de cookies: " + error
    );
    sendGAErrors(e);
  };

  var lgpdCookieDefault = function () {
    try {
      var xhr = new XMLHttpRequest();

      xhr.open(
        "GET",
        globalConfig.basePathAssetsJS + globalConfig.categorizedCookiesJsonURL,
        true
      );
      xhr.send();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status >= 200 && this.status <= 299) {
          lgpdCookie = JSON.parse(this.response);
          identifyCookies();
        }
      });

      xhr.addEventListener("error", sendError, false);
      xhr.addEventListener("timeout", sendError, false);
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var deleteUnknownOrRejectCookies = function (list, type) {
    try {
      var unknownCookies = [],
        status;

      list.forEach(function (item) {
        status = lgpdCookieOptimzedForSearch.complete[item];

        if (!status) {
          lgpdCookieOptimzedForSearch.part.some(function (e) {
            if (item.indexOf(e.key) !== -1) {
              status = e.status;
              return false;
            }
          });
        }

        if (!status) {
          unknownCookies.push(item);
          deleteCookie(item, type);
        }

        if (globalConfig.deleteCookies !== false) {
          if (status === "REJEITADO" && !lgpdCookieIsDefault) {
            deleteCookie(item, type);
          }
        }
      });

      if (unknownCookies.length > 0) {
        window.dataLayer.push({
          event: "gaEvent",
          eventCategory: "cookies-monitor",
          eventAction: "unknown-" + type,
          eventLabel: unknownCookies.join("|"),
        });
      }
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var identifyCookies = function () {
    try {
      lgpdCookie.detalhes.forEach(function (detalhe) {
        detalhe.cookies.forEach(function (cookie) {
          cookie.itens.forEach(function (item) {
            if (item.indexOf("*") === -1) {
              lgpdCookieOptimzedForSearch.complete[item] = detalhe.status;
            } else {
              lgpdCookieOptimzedForSearch.part.push({
                key: item.split("*")[0],
                status: detalhe.status,
              });
            }
          });
        });
      });

      // Se o usuário não tiver o cookie de categorias de aceite
      if (!getCookie("lgpd-cookie")) {
        initCookiesConsent();
      }

      // Se o usuário já tiver realizado o aceite com a versão antiga, não é apagado
      // os cookies antes de ele redefinir suas opções
      if (!getCookie("cookieAceitoID") || getCookie("lgpd-cookie")) {
        deleteUnknownOrRejectCookies(getCookieList(), "cookies");

        // TODO: Aplicar regra de remoção para localStorage e sessionStorage depois de analisar possíveis problemas
        // deleteUnknownOrRejectCookies(Object.keys(localStorage), 'localStorage');
        // deleteUnknownOrRejectCookies(Object.keys(sessionStorage), 'sessionStorage');

        // console.timeEnd('Tempo Carregamento');
      }

      createEvent("CookiesMonitorReady");
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var update = function () {
    try {
      init(globalConfig);
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var initCookiesConsent = function () {
    try {
      cookieConsentLoading = true;

      // API de consentimento de Cookies
      includeScript({
        src: globalConfig.basePathAssetsJS + globalConfig.cookiesConsentFileJS,
        callback: function () {
          CookiesConsent.init(globalConfig);
        },
      });
    } catch (e) {
      sendGAErrors(e);
    }
  };

  var openManagement = function () {
    try {
      if (typeof CookiesConsent === "object") {
        CookiesConsent.cookiesManagement();
      } else {
        if (!cookieConsentLoading) {
          initCookiesConsent();
        }

        document.addEventListener("CookiesConsentReady", function () {
          CookiesConsent.cookiesManagement();
        });
      }

      createEvent("CookiesMonitorOpenManagement");
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

  try {
    document
      .querySelectorAll(".js-open-cookies-management")
      .forEach(function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          openManagement();
        });
      });
  } catch (e) {
    sendGAErrors(e);
  }

  return {
    init: init,
    update: update,
    includeScript: includeScript,
    getLgpdCookie: getLgpdCookie,
    getCookie: getCookie,
    openManagement: openManagement,
  };
})();
