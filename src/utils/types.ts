export interface searchResults {
  id: number;
  title?: string;
  date?: Date;
  channel_name?: string;
  channel_id?: number;
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
