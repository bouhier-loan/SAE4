/* Shift the date by a number of seconds
 * @param {Number} seconds - The number of seconds to shift the date by
 * @returns {Date} - The shifted date
 */
function dateShift(date, seconds) {
    date.setTime(date.getTime() + (seconds*1000));
    return date;
}

module.exports = dateShift;