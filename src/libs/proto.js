String.prototype.substr_replace = function (replaceStr, start, length = null) {
    if (length == null) {
        length = this.length;
    }
    if (start < 0) {
        start += this.length;
    }
    let end = 0;
    if (length < 0) {
        end = this.length + length;
    } else {
        end = start + length;
    }
    return this.substring(0, start) + replaceStr + this.substring(end, this.length);
}

String.prototype.trim = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.trimLeft = function (char) {
    if (char) {
        return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
    }
    return this.replace(/^\s+/g, '');
};
String.prototype.trimRight = function (char) {
    if (char) {
        return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
    }
    return this.replace(/\s+$/g, '');
};