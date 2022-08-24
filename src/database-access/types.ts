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

export interface searchResults {
  id: number;
  title?: string;
  date?: Date;
  channel_name?: string;
  channel_id?: number;
}
