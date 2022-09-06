import { Events } from "discord.js";
import Bot from "./bot";

export default interface Event {
  client: Bot;
  name: Events | CustomEvents;
  once?: boolean;
  execute: (...args: any) => void;
}

export enum CustomEvents {
  SongRequest = "songRequest",
}


