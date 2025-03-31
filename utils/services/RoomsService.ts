import type Room from "~/models/Room";
import { get } from "~/utils/services/base/ApiService";

class RoomsService {
  public async Get() {
    // here should be a call to the API to get the temperature, we use the mock data for now
    const rooms: Room[] = await get("/mocks/rooms.json");

    return rooms;
  }
}

export default RoomsService;