import config from "@/public/config.json";
import ChartData from "~/models/ChartData";
import Dataset from "~/models/Dataset";
import type SensorData from "~/models/SensorData";

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

  public static MapAirQuality(airQuality: number) {
    const { title, icon, normalRange } = config.airQuality;
    return {
      title,
      text: airQuality + " ppm",
      icon,
      normalRange,
    };
  }

  public static MapChartData(temperature: SensorData[]) {
    const { title } = config.temperature;
    const chartColor = config.chartColor;

    const labels = temperature.map((temperature) => {
      const date = new Date(temperature.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      temperature.map((temperature) => {
        return temperature.value;
      }),
      false,
      chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapChartDataHumidity(humidity: SensorData[]) {
    const { title } = config.humidity;
    const chartColor = config.chartColor;

    const labels = humidity.map((humidity) => {
      const date = new Date(humidity.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      humidity.map((humidity) => {
        return humidity.value;
      }),
      false,
      chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapChartDataAirQuality(airQuality: SensorData[]) {
    const { title } = config.airQuality;
    const chartColor = config.chartColor;

    const labels = airQuality.map((airQuality) => {
      const date = new Date(airQuality.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      airQuality.map((airQuality) => {
        return airQuality.value;
      }),
      false,
      chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }
}

export default GlobalHelper;
