import SensorData from '~/models/SensorData';

class Room {
  id: number;
  name: string;
  description: string;
  environmentData: {
    temperature: SensorData[];
    humidity: SensorData[];
    airQuality: SensorData[];
  }

  constructor(id: number, name: string, description: string, environmentData: { temperature: SensorData[]; humidity: SensorData[]; airQuality: SensorData[] }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.environmentData = environmentData;
  }
}

export default Room;