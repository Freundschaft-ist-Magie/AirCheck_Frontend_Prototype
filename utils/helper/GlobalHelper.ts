import config from "@/public/config.json";
import ChartData from "~/models/ChartData";
import Dataset from "~/models/Dataset";
import type SensorData from "~/models/SensorData";

class GlobalHelper {
  public static MapTemperature(themperature: number) {
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

  public static MapChartDataTemperature(temperature: SensorData[], isForecast: boolean = false) {
    const { title, chartColor } = config.temperature;
    const forecastColor = config.forecastColor;

    const labels = temperature.map((temperature) => {
      const date = new Date(temperature.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      temperature.map((temperature) => {
        return Number(temperature.value);
      }),
      false,
      isForecast ? forecastColor : chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapChartDataHumidity(humidity: SensorData[], isForecast: boolean = false) {
    const { title, chartColor } = config.humidity;
    const forecastColor = config.forecastColor;

    const labels = humidity.map((humidity) => {
      const date = new Date(humidity.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      humidity.map((humidity) => {
        return Number(humidity.value);
      }),
      false,
      isForecast ? forecastColor : chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapChartDataAirQuality(airQuality: SensorData[], isForecast: boolean = false) {
    const { title, chartColor } = config.airQuality;
    const forecastColor = config.forecastColor;

    const labels = airQuality.map((airQuality) => {
      const date = new Date(airQuality.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      airQuality.map((airQuality) => {
        return Number(airQuality.value);
      }),
      false,
      isForecast ? forecastColor : chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapCombinedChartData(actualData: SensorData[], forecastData: SensorData[], dataType: 'temperature' | 'humidity' | 'airQuality') {
    const { title, chartColor } = config[dataType];
    const forecastColor = config.forecastColor;

    // Combine timestamps from both datasets for the x-axis
    const allTimestamps = [
      ...actualData.map(item => item.timestamp),
      ...forecastData.map(item => item.timestamp)
    ].sort();

    const labels = allTimestamps.map(timestamp => {
      const date = new Date(timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    // Create actual data dataset
    const actualDataset = new Dataset(
      `${title}`,
      // Map values, using null for timestamps not in actualData
      allTimestamps.map(timestamp => {
        const dataPoint = actualData.find(item => item.timestamp === timestamp);
        return dataPoint ? Number(dataPoint.value) : null;
      }),
      false,
      chartColor,
      0.4
    );

    // Create forecast data dataset
    const forecastDataset = new Dataset(
      `${title} (Prognose)`,
      // Map values, using null for timestamps not in forecastData
      allTimestamps.map(timestamp => {
        const dataPoint = forecastData.find(item => item.timestamp === timestamp);
        return dataPoint ? Number(dataPoint.value) : null;
      }),
      false,
      forecastColor,
      0.4
    );

    return new ChartData(labels, [actualDataset, forecastDataset]);
  }
}

export default GlobalHelper;
