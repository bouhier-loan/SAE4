/* Shift the date by a number of seconds
 * @param {Number} seconds - The number of seconds to shift the date by
 * @returns {Date} - The shifted date
 */
Date.prototype.shift = function(seconds) {
    this.setTime(this.getTime() + (seconds*1000));
    return this;
}