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

    const labels = temperature.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      temperature.map((reading) => {
        return Number(reading.value);
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

    const labels = humidity.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      humidity.map((reading) => {
        return Number(reading.value);
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

    const labels = airQuality.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[1].split(".")[0];
      return date;
    });

    const dataset = new Dataset(
      title,
      airQuality.map((reading) => {
        return Number(reading.value);
      }),
      false,
      isForecast ? forecastColor : chartColor,
      0.4
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapHistoryChartDataTemperature(history: any, room: any) {
    const { title, chartColor } = config.temperature;

    const selectedRoom = history.find(historyRoom => historyRoom.id === room.id).environmentData.temperature;

    const labels = selectedRoom.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[0];
      return GlobalHelper.formatDateToDayMonth(date);
    });

    const dataset = new Dataset(
        title,
        selectedRoom.map((reading) => {
          return Number(reading.value);
        }),
        false,
        chartColor,
        0
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapHistoryChartDataHumidity(history: any, room: any) {
    const { title, chartColor } = config.humidity;

    // Shouldn't be hardcoded :(
    const selectedRoom = history.find(historyRoom => historyRoom.id === room.id).environmentData.humidity;

    const labels = selectedRoom.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[0];
      return GlobalHelper.formatDateToDayMonth(date);
    });

    const dataset = new Dataset(
        title,
        selectedRoom.map((reading) => {
          return Number(reading.value);
        }),
        false,
        chartColor,
        0
    );

    return new ChartData(labels, [dataset]);
  }

  public static MapHistoryChartDataAirQuality(history: any, room: any) {
    const { title, chartColor } = config.airQuality;

    // Shouldn't be hardcoded :(
    const selectedRoom = history.find(historyRoom => historyRoom.id === room.id).environmentData.airQuality;

    const labels = selectedRoom.map((reading) => {
      const date = new Date(reading.timestamp).toISOString().split("T")[0];
      return GlobalHelper.formatDateToDayMonth(date);
    });

    const dataset = new Dataset(
        title,
        selectedRoom.map((reading) => {
          return Number(reading.value);
        }),
        false,
        chartColor,
        0
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

  public static formatDateToDayMonth(timestamp: string): string {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("de-DE", { month: "short" });
    return `${day}. ${month}`;
  }


}

export default GlobalHelper;
