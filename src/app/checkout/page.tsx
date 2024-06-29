import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function checkoutAction (formData : FormData) {
  "use server"
  const cookie = cookies()
  const eventId = cookie.get("eventId")?.value
  if (!eventId) {
    return { error: "Missing event id." }
  }
  const spots = await getReservedSpots()
  if (!spots.length) {
    return { error: "Select at least one spot." }
  }
  await fetch(`http://localhost:8000/events/${eventId}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spots }),
  })
  cookie.delete("eventId")
  cookie.delete("spots")
  redirect("/")
}

async function getReservedSpots () {
  "use server"
  const reservedSpots = cookies().get("spots")?.value
  return reservedSpots ? JSON.parse(reservedSpots) : []
}

async function getTotalPrice () {
  "use server"
  return cookies().get("totalPrice")?.value || "Error"
}

export default async function Checkout () {

  const reservedSpots = await getReservedSpots()
  const totalPrice = await getTotalPrice()

  return (
    <form action={checkoutAction}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl text-black font-bold">Order Summary</h2>
            <p className="text-gray-700 mt-2">
              Reserved spots: {reservedSpots.join(", ")}
            </p>
            <p className="text-gray-700 mt-2">Total: R$ {totalPrice}</p>
            <p className="text-gray-700 mt-2">
              <button type="submit" className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                Confirm Purchase
              </button>
            </p>
          </div>
        </div>
      </div>
    </form>
  )

}