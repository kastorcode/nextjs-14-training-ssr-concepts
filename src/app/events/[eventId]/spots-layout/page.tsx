import { cookies } from "next/headers"
import Link from "next/link"
import { SpotSeat } from "~/components/SpotSeat"
import { EventModel, SpotModel, SpotStatus } from "~/models"

async function getEvent (eventId : string) : Promise<{ event : EventModel, spots : SpotModel[] }> {
  "use server"
  const response = await fetch(`http://localhost:8000/events/${eventId}`, {
    next: {
      tags: [`events/${eventId}`]
    }
  })
  return response.json()
}

async function reserveSpotsAction (formData : FormData) {
  "use server"
  const eventId = formData.get("eventId")
  if (!eventId) {
    return { error: "Missing event id." }
  }
  const eventPrice = formData.get("eventPrice")
  if (!eventPrice) {
    return { error: "Missing event price." }
  }
  const eventPriceParsed = parseFloat(eventPrice.toString())
  const spots = formData.getAll("spots")
  if (!spots.length) {
    return { error: "Select at least one spot." }
  }
  const cookie = cookies()
  cookie.set("eventId", eventId.toString())
  cookie.set("totalPrice", (eventPriceParsed * spots.length).toString())
  cookie.set("spots", JSON.stringify(spots))
}

export default async function SpotsLayout ({ params } : { params : { eventId : string }}) {

  const { event, spots } = await getEvent(params.eventId)

  const rowLetters = spots.map(spot => spot.name[0])

  const uniqueRowLetters = rowLetters.filter((letter, index) => rowLetters.indexOf(letter) === index)

  const spotGroupedByRow = uniqueRowLetters.map(letter => {
    return {
      row: letter, spots: spots.filter(spot => spot.name[0] === letter)
    }
  })

  const reservedSpotsRaw = cookies().get("spots")?.value
  const reservedSpots = reservedSpotsRaw ? JSON.parse(reservedSpotsRaw) : []

  return (
    <form action={reserveSpotsAction}>
      <input type="hidden" name="eventId" value={params.eventId} />
      <input type="hidden" name="eventPrice" value={event.price} />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Spots</h1>
        { spotGroupedByRow.map(row => (
          <div key={row.row} className="flex flex-row gap-3 items-center mb-3">
            <div className="w-4">{row.row}</div>
            <div className="ml-2 flex flex-row">
              { row.spots.map((spot, index) => (
                <SpotSeat
                  key={index}
                  spotId={spot.name}
                  spotLabel={spot.name.slice(1)}
                  reserve={reservedSpots.includes(spot.name)}
                  disabled={spot.status === SpotStatus.sold}
                />
              ))}
            </div>
          </div>
        ))}
        <p className="text-white mt-2">
          Chosen spots: {reservedSpots.join(", ")}
        </p>
        <p className="mt-2">
          <button
            className="bg-white hover:bg-gray-700 hover:text-white text-black font-bold py-2 px-4 rounded"
            type="submit"
          >
            Reserve
          </button>
        </p>
        <p className="mt-4">
          <Link
            className="bg-gray-700 hover:bg-gray-500 hover:text-white text-white font-bold py-2 px-4 rounded"
            href="/checkout"
          >
            Purchase
          </Link>
        </p>
      </main>
    </form>
  )

}