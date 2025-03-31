import config from "@/public/config.json";

class GlobalHelper {
  public static MapThemperature(themperature: number) {
    const { title, icon, normalRange } = config.temperature;
    return {
      title,
      text: themperature + " °C",
      icon,
      normalRange,
    };
  }

  public static MapHumidity(humidity: number) {
    const { title, icon, normalRange } = config.humidity;
    return {
      title,
      text: humidity + " %",
      icon,
      normalRange,
    };
  }

  public static MapairQuality(airQuality: number) {
    const { title, icon, normalRange } = config.airQuality;
    return {
      title,
      text: airQuality + " ppm",
      icon,
      normalRange,
    };
  }
}

export default GlobalHelper;
