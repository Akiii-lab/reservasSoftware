export const HOURS = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

export const getHourRange = (start: string, end: string): string[] => {
    const startIdx = HOURS.indexOf(start);
    const endIdx = HOURS.indexOf(end);
    if (startIdx === -1 || endIdx === -1) return [];
    const [minIdx, maxIdx] = startIdx <= endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    return HOURS.slice(minIdx, maxIdx + 1);
};

// Convierte formato "HH:MM" a "HH:MM:SS" para el backend
export const toBackendFormat = (hour: string): string => {
    if (!hour) return "";
    return hour.includes(":00:00") ? hour : `${hour}:00`;
};

// Convierte formato "HH:MM:SS" a "HH:MM" para display
export const toDisplayFormat = (hour: string): string => {
    if (!hour) return "";
    return hour.substring(0, 5);
};