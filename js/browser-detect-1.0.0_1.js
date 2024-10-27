var browserDetect = (function () {

    'use strict';

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var browsers = [
        ['Firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
        ['Opera', /Opera\/([0-9\.]+)(?:\s|$)/],
        ['Opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
        ['Edge', /Edge\/([0-9\._]+)/],
        ['IE', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
        ['IE', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
        ['IE', /MSIE\s(7\.0)/],
        ['Safari', /Version\/([0-9\._]+).*Safari/],
        ['Chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
        ['BB10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
        ['Android', /Android\s([0-9\.]+)/],
        ['iOS', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
        ['YandexBrowser', /YaBrowser\/([0-9\._]+)/],
        ['CriOS', /CriOS\/([0-9\.]+)(:?\s|$)/]
    ];
    var os = [
        'Windows Phone',
        'Android',
        'CentOS',
        { name: 'Chrome OS', pattern: 'CrOS' },
        'Debian',
        'Fedora',
        'FreeBSD',
        'Gentoo',
        'Haiku',
        'Kubuntu',
        'Linux Mint',
        'OpenBSD',
        'Red Hat',
        'SuSE',
        'Ubuntu',
        'Xubuntu',
        'Cygwin',
        'Symbian OS',
        'hpwOS',
        'webOS ',
        'webOS',
        'Tablet OS',
        'Tizen',
        'Linux',
        'Mac OS X',
        'Macintosh',
        'Mac',
        'Windows 98;',
        'Windows '
    ];
    var osVersions = {
        '10.0': '10',
        '6.4': '10 Technical Preview',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': 'Server 2008 R2 / 7',
        '6.0': 'Server 2008 / Vista',
        '5.2': 'Server 2003 / XP 64-bit',
        '5.1': 'XP',
        '5.01': '2000 SP1',
        '5.0': '2000',
        '4.0': 'NT',
        '4.90': 'ME'
    };

    var mobileRegExp = new RegExp(['(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|',
        'compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|',
        'midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)',
        '\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|',
        'wap|windows ce|xda|xiino'].join(''), 'i');
    var mobilePrefixRegExp = new RegExp(['1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|',
        'ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|',
        'avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|',
        'cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|',
        'ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|',
        'g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|',
        'hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|',
        'i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|',
        'kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])',
        '|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|',
        'mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|',
        'n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|',
        'op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|',
        'po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|',
        'raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|',
        'se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|k\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|',
        'so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|',
        'tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|',
        'veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|',
        'w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-'].join(''), 'i');

    var Detector = /** @class */ (function () {
        function Detector(userAgent, navigator, process) {
            this.navigator = navigator;
            this.process = process;
            this.userAgent = userAgent
                ? userAgent
                : this.navigator ? (navigator.userAgent || navigator.vendor) : '';
        }
        Detector.prototype.detect = function () {
            if (this.process && !this.userAgent) {
                var version = this.process.version.slice(1).split('.').slice(0, 3);
                var versionTail = Array.prototype.slice.call(version, 1).join('') || '0';
                return {
                    name: 'node',
                    version: version.join('.'),
                    versionNumber: parseFloat(version[0] + "." + versionTail),
                    mobile: false,
                    os: this.process.platform
                };
            }
            if (!this.userAgent)
                this.handleMissingError();
            return __assign({}, this.checkBrowser(), this.checkMobile(), this.checkOs());
        };
        Detector.prototype.checkBrowser = function () {
            var _this = this;
            return browsers
                .filter(function (definition) { return definition[1].test(_this.userAgent); })
                .map(function (definition) {
                    var match = definition[1].exec(_this.userAgent);
                    var version = match && match[1].split(/[._]/).slice(0, 3);
                    var versionTails = Array.prototype.slice.call(version, 1).join('') || '0';
                    if (version && version.length < 3)
                        Array.prototype.push.apply(version, version.length === 1 ? [0, 0] : [0]);
                    return {
                        name: String(definition[0]),
                        version: version.join('.'),
                        versionNumber: Number(version[0] + "." + versionTails)
                    };
                })
                .shift();
        };
        Detector.prototype.checkMobile = function () {
            var agentPrefix = this.userAgent.substr(0, 4);
            var mobile = mobileRegExp.test(this.userAgent) || mobilePrefixRegExp.test(agentPrefix);
            return { mobile: mobile };
        };
        Detector.prototype.checkOs = function () {
            var _this = this;
            return os
                .map(function (definition) {
                    var name = definition.name || definition;
                    var pattern = _this.getOsPattern(definition);
                    return {
                        name: name,
                        pattern: pattern,
                        value: RegExp("\\b" + pattern.replace(/([ -])(?!$)/g, '$1?') + "(?:x?[\\d._]+|[ \\w.]*)", 'i').exec(_this.userAgent)
                    };
                })
                .filter(function (definition) { return definition.value; })
                .map(function (definition) {
                    var os$$1 = definition.value[0] || '';
                    var osSuffix;
                    if (definition.pattern &&
                        definition.name &&
                        /^Win/i.test(os$$1) &&
                        !/^Windows Phone /i.test(os$$1) &&
                        (osSuffix = osVersions[os$$1.replace(/[^\d.]/g, '')]))
                        os$$1 = "Windows " + osSuffix;
                    if (definition.pattern && definition.name)
                        os$$1 = os$$1.replace(RegExp(definition.pattern, 'i'), definition.name);
                    os$$1 = os$$1
                        .replace(/ ce$/i, ' CE')
                        .replace(/\bhpw/i, 'web')
                        .replace(/\bMacintosh\b/, 'Mac OS')
                        .replace(/_PowerPC\b/i, ' OS')
                        .replace(/\b(OS X) [^ \d]+/i, '$1')
                        .replace(/\bMac (OS X)\b/, '$1')
                        .replace(/\/(\d)/, ' $1')
                        .replace(/_/g, '.')
                        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
                        .replace(/\bx86\.64\b/gi, 'x86_64')
                        .replace(/\b(Windows Phone) OS\b/, '$1')
                        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
                        .split(' on ')[0]
                        .trim();
                    os$$1 = /^(?:webOS|i(?:OS|P))/.test(os$$1)
                        ? os$$1
                        : (os$$1.charAt(0).toUpperCase() + os$$1.slice(1));
                    return { os: os$$1 };
                })
                .shift();
        };
        Detector.prototype.getOsPattern = function (definition) {
            var definitionInterface = definition;
            return (typeof definition === 'string'
                ? definition
                : undefined) ||
                definitionInterface.pattern ||
                definitionInterface.name;
        };
        Detector.prototype.handleMissingError = function () {
            throw new Error('Please give user-agent.\n> browser(navigator.userAgent or res.headers[\'user-agent\']).');
        };
        return Detector;
    }());

    var injectableNavigator = typeof window !== 'undefined'
        ? window.navigator
        : undefined;

    var injectableProcess = typeof process !== 'undefined'
        ? process
        : undefined;

    function browserDetect(userAgent) {
        var detector = new Detector(userAgent, injectableNavigator, injectableProcess);
        return detector.detect();
    }

    return browserDetect;

})();

