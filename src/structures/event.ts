import { Events } from "discord.js";
import Bot from "./bot";

export default interface Event {
  client: Bot;
  name: Events | CustomEvents;
  once?: boolean;
  execute: (...args: any) => void;
}

export enum CustomEvents {
  BotDisconnect = "botDisconnect",
  ChannelEmpty = "channelEmpty",
  ConnectionError = "connectionError",
  QueueEnd = "queueEnd",
  TrackStart = "trackStart",
}


