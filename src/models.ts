export type EventModel = {
  id              : number
  name            : string
  date            : string
  image_url       : string
  created_at      : string
  available_spots : number
  price           : number
}

export type SpotModel = {
  id       : number
  event_id : number
  name     : string
  status   : SpotStatus
}

export enum SpotStatus {
  available = "available",
  sold      = "sold"
}