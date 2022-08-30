export interface channelOutput {
  id: number;
  titles: string[];
  channel_name: string;
}

export interface videoOutput {
  id: number;
  title: string;
  date: Date;
  channel_name: string;
  channel_id: number;
}

export interface dataYT {
  title: string;
  date: Date;
  channelName: string;
  id?: number;
}

export interface insertChannelVideos {
  channelName: string;
  channelID?: number;
}

export interface videoResults {
  id: number;
  title: string;
  date: Date;
  channel_id: number;
}
export interface channelResults {
  id: number;
  channel_name: string;
}
