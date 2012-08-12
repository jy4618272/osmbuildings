
function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = arguments.length < 4 ? 1 : a;
}

Color.prototype.toString = function () {
    return 'rgba(' + [this.r, this.g, this.b, this.a].join(',') + ')';
}

Color.prototype.adjustLightness = function (amount) {
    var hsla = Color.toHSLA(this);
    hsla.l += amount;
    hsla.l = Math.min(1, Math.max(0, hsla.l));
    return Color.toRGB(hsla);
};

Color.prototype.adjustAlpha = function (a) {
    return new Color(this.r, this.g, this.b, this.a * a);
};

Color.parse = function(str) {
    var m;
    if (~str.indexOf('#')) {
        m = str.match(/^#?(\w{2})(\w{2})(\w{2})$/);
        return new Color(
            parseInt(m[1], 16),
            parseInt(m[2], 16),
            parseInt(m[3], 16)
        );
    }

    m = str.match(/rgba?\((\d+)\D+(\d+)\D+(\d+)(\D+([\d.]+))?\)/);
    return new Color(
        m[1],
        m[2],
        m[3],
        m[4] ? m[5] : 1
    );
};

Color.toHSLA = function (rgba) {
    var
        r = rgba.r / 255,
        g = rgba.g / 255,
        b = rgba.b / 255,
        max = Math.max(r, g, b), min = Math.min(r, g, b),
        h, s, l = (max + min) / 2,
        d
    ;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, l: l, a: rgba.a };
};

Color.toRGB = function (hsla) {
    var r, g, b;

    if (hsla.s == 0) {
        r = g = b = hsla.l; // achromatic
    } else {
        var
            q = hsla.l < 0.5 ? hsla.l * (1 + hsla.s) : hsla.l + hsla.s - hsla.l * hsla.s,
            p = 2 * hsla.l - q
        ;
        r = Color.hueToRGB(p, q, hsla.h + 1/3);
        g = Color.hueToRGB(p, q, hsla.h);
        b = Color.hueToRGB(p, q, hsla.h - 1/3);
    }
    return new Color(
        ~~(r * 255),
        ~~(g * 255),
        ~~(b * 255),
        hsla.a
    );
};

Color.hueToRGB = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
};