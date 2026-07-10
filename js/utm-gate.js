// Qualifica visitantes como "tráfego pago real" com base nas UTMs da URL,
// persiste essas UTMs para a Utmify atribuir a venda depois, e só libera
// o link de checkout/pre-sell para quem passou na checagem.

var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

// Ajuste esta lista para os utm_source que você realmente compra mídia
// (ex: facebook, tiktok, google). Deixe null para aceitar qualquer utm_source.
var ALLOWED_SOURCES = ['FB'];

var OFFER_URL = 'https://signalreviewhub.com/';
var FALLBACK_URL = 'https://dailyhealthtipss.com/4p0l10/t3sl4/l5lc/';

function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    UTM_KEYS.forEach(function (key) {
        var value = params.get(key);
        if (value) utm[key] = value;
    });
    return utm;
}

function loadStoredUtm() {
    try {
        return JSON.parse(localStorage.getItem('utm_data') || '{}');
    } catch (e) {
        return {};
    }
}

function isRealTraffic(utm) {
    if (!utm.utm_source || !utm.utm_campaign) return false;
    if (ALLOWED_SOURCES && ALLOWED_SOURCES.indexOf(utm.utm_source) === -1) return false;
    return true;
}

var utmFromUrl = getUtmParams();
var utmData = Object.keys(utmFromUrl).length ? utmFromUrl : loadStoredUtm();

if (Object.keys(utmFromUrl).length) {
    localStorage.setItem('utm_data', JSON.stringify(utmFromUrl));
}

var isQualifiedTraffic = isRealTraffic(utmData);

function buildOfferUrl(baseUrl) {
    var params = new URLSearchParams();
    Object.keys(utmData).forEach(function (key) {
        params.set(key, utmData[key]);
    });
    var query = params.toString();
    if (!query) return baseUrl;
    return baseUrl + (baseUrl.indexOf('?') > -1 ? '&' : '?') + query;
}

function goToOffer() {
    if (!isQualifiedTraffic) {
        window.location.href = FALLBACK_URL;
        return;
    }
    window.location.href = buildOfferUrl(OFFER_URL);
}
