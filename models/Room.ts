class Room {
  Id: number;
  Humidity: number;
  Temperature: number;
  Pressure: number;
  Gas: number;
  TimeStamp: string;
  Room: { id: number; macAddress: string } | null;
  RoomId: number;

  constructor(
    id: number,
    humidity: number,
    temperature: number,
    pressure: number,
    gas: number,
    timeStamp: string,
    roomId: number
  ) {
    this.Id = id;
    this.Humidity = humidity;
    this.Temperature = temperature;
    this.Pressure = pressure;
    this.Gas = gas;
    this.TimeStamp = timeStamp;
    this.RoomId = roomId;
    this.Room = null;
  }
}

export default Room;
