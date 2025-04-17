import { defineStore } from 'pinia';
import { get } from "~/utils/services/base/ApiService";
import type Room from "~/models/Room";

export const useRoomsStore = defineStore("rooms", () => {
  const _roomBaseUrl = "RoomDatas";
  const _rooms = ref([])
  const rooms = computed(() => _rooms);

  async function GetAll() {
    const _rooms: Room[] = await get(_roomBaseUrl);

    return _rooms;
  }

  return { rooms, GetAll };
});