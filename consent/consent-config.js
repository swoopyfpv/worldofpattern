/**
 * Pixxwell Consent-Kit – Konfiguration
 * CookieConsent v3.1 + iframemanager v1.3 (beide MIT, selbst gehostet)
 *
 * Kategorien:
 *   essentiell      – immer aktiv, nicht abwählbar
 *   statistiken     – Analyse-Tools (Matomo, Umami, GA4 …)
 *   externe_medien  – YouTube, Vimeo, Google Maps (über iframemanager)
 *
 * PRO PROJEKT ANPASSEN: siehe Abschnitt "PROJEKT-EINSTELLUNGEN".
 */
(function () {
  'use strict';

  /* ===================== PROJEKT-EINSTELLUNGEN ===================== */
  var SITE = {
    privacyUrl: 'datenschutz.html',
    imprintUrl: 'impressum.html',
    // Bei Änderung der Konfiguration erhöhen → Banner erscheint erneut
    revision: 1
  };

  // Welche Statistik-Dienste nutzt das Projekt? Nicht benötigte entfernen.
  // Der Schlüssel muss zu data-service="…" am <script>-Tag passen.
  // worldofpattern: keine Statistik-Dienste
  var STATISTIK_SERVICES = {};
  /* ================================================================= */

  var im = iframemanager();

  // Externe Medien: Dienste, die iframemanager als Platzhalter verwaltet
  // worldofpattern: keine externen Medien
  var MEDIA = {};

  /* ---------- iframemanager ---------- */
  var imServices = {};
  Object.keys(MEDIA).forEach(function (key) {
    var m = MEDIA[key];
    imServices[key] = {
      embedUrl: m.embedUrl,
      // Bewusst KEIN thumbnailUrl: Externe Vorschaubilder würden vor der
      // Einwilligung die IP an Google o. a. senden. Eigene Vorschaubilder
      // per data-thumbnail="/pfad/bild.jpg" am Platzhalter setzen.
      iframe: { allow: m.allow },
      cookie: { name: 'im_' + key, samesite: 'Lax' },
      languages: {
        de: { notice: m.notice, loadBtn: m.loadBtn, loadAllBtn: 'Immer laden' }
      }
    };
  });

  im.run({
    currLang: 'de',
    services: imServices,
    // "Immer laden" im Platzhalter → Einwilligung auch in CookieConsent speichern
    onChange: function (e) {
      if (e.eventSource.type !== 'click') return;
      var prefs = CookieConsent.getUserPreferences();
      var accepted = (prefs.acceptedServices && prefs.acceptedServices.externe_medien) || [];
      var merged = accepted.concat(e.changedServices).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      });
      CookieConsent.acceptService(merged, 'externe_medien');
    }
  });

  /* ---------- CookieConsent ---------- */
  var mediaServices = {};
  Object.keys(MEDIA).forEach(function (key) {
    mediaServices[key] = {
      label: MEDIA[key].label,
      onAccept: function () { im.acceptService(key); },
      onReject: function () { im.rejectService(key); }
    };
  });

  var statServices = {};
  Object.keys(STATISTIK_SERVICES).forEach(function (key) {
    statServices[key] = { label: STATISTIK_SERVICES[key].label };
  });
  var statCookies = [];
  Object.keys(STATISTIK_SERVICES).forEach(function (key) {
    statCookies = statCookies.concat(STATISTIK_SERVICES[key].cookies || []);
  });

  var footer =
    '<a href="' + SITE.privacyUrl + '">Datenschutz</a>' +
    '<a href="' + SITE.imprintUrl + '">Impressum</a>';

  CookieConsent.run({
    revision: SITE.revision,
    mode: 'opt-in',               // nichts läuft ohne aktive Zustimmung
    hideFromBots: true,
    disablePageInteraction: false,

    cookie: {
      name: 'consent',
      expiresAfterDays: 365,       // danach erneute Abfrage
      sameSite: 'Lax'
    },

    guiOptions: {
      consentModal: {
        layout: 'box',
        position: 'bottom right',
        equalWeightButtons: true,  // "Akzeptieren" und "Ablehnen" gleichwertig (DSK-Anforderung)
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false
      }
    },

    categories: {
      essentiell: {
        enabled: true,
        readOnly: true
      }
    },

    language: {
      default: 'de',
      translations: {
        de: {
          consentModal: {
            title: 'Datenschutz-Einstellungen',
            description:
              'Diese Website verwendet nur technisch notwendige Cookies. Es werden keine ' +
              'Statistik-Tools und keine Inhalte von Drittanbietern geladen. Ihre Auswahl können ' +
              'Sie jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur essentielle',
            showPreferencesBtn: 'Einstellungen',
            footer: footer
          },
          preferencesModal: {
            title: 'Cookie-Einstellungen',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur essentielle',
            savePreferencesBtn: 'Auswahl speichern',
            closeIconLabel: 'Schließen',
            serviceCounterLabel: 'Dienst|Dienste',
            sections: [
              {
                description:
                  'Hier entscheiden Sie, welche Kategorien wir verwenden dürfen. ' +
                  'Weitere Informationen finden Sie in unserer <a href="' + SITE.privacyUrl + '">Datenschutzerklärung</a>.'
              },
              {
                title: 'Essentiell <span class="pm__badge">Immer aktiv</span>',
                description:
                  'Für den Betrieb der Website erforderlich, z. B. zum Speichern Ihrer Datenschutz-Auswahl. ' +
                  'Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.',
                linkedCategory: 'essentiell'
              }
            ]
          }
        }
      }
    }
  });
})();
