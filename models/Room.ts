class Room {
  id: number;
  humidity: number;
  temperature: number;
  pressure: number;
  gas: number;
  timeStamp: string;
  room: { id: number; macAddress: string } | null;
  roomId: number;

  constructor(
    id: number,
    humidity: number,
    temperature: number,
    pressure: number,
    gas: number,
    timeStamp: string,
    roomId: number
  ) {
    this.id = id;
    this.humidity = humidity;
    this.temperature = temperature;
    this.pressure = pressure;
    this.gas = gas;
    this.timeStamp = timeStamp;
    this.roomId = roomId;
    this.room = null;
  }
}

export default Room;
