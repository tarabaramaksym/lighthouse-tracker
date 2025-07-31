class ScheduleValidator {
  /**
   * Validates if a time string is in 15-minute intervals
   * @param {string} timeString - Time in HH:MM format
   * @returns {boolean} - True if valid 15-minute interval
   */
  static isValid15MinuteInterval(timeString) {
    if (!timeString || typeof timeString !== 'string') {
      return false;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeString)) {
      return false;
    }

    const [, hours, minutes] = timeString.match(timeRegex);
    const minutesNum = parseInt(minutes, 10);

    return minutesNum % 15 === 0;
  }

  /**
   * Gets all valid 15-minute interval times for a day
   * @returns {string[]} - Array of valid time strings
   */
  static getValidTimes() {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  }

  /**
   * Formats a time string to ensure proper HH:MM format
   * @param {string} timeString - Input time string
   * @returns {string|null} - Formatted time string or null if invalid
   */
  static formatTime(timeString) {
    if (!this.isValid15MinuteInterval(timeString)) {
      return null;
    }

    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
}

module.exports = ScheduleValidator; 