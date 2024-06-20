import {
	array,
	boolean,
	date,
	nullable,
	number,
	object,
	string,
} from "valibot";

export const bundleSchema = object({
	id: number(),
	images: array(string()),
	rating: number(),
	reviews: number(),
	name: string(),
	description: string(),
	details: array(
		object({
			price: number(),
			date: date(),
			embarkation: string(),
			roomType: string(),
			makkahHotel: object({
				thumbnail: string(),
				rating: number(),
				name: string(),
				help: string(),
				images: array(string()),
				checkin: date(),
				duration: number(),
				checkout: date(),
				description: string(),
				facilities: array(
					object({
						icon: string(),
						name: string(),
					}),
				),
				map: string(),
				address: string(),
				distance: number(),
				foodType: string(),
				foodAmount: number(),
				foodMenu: array(
					object({
						amount: number(),
						name: string(),
					}),
				),
				review: number(),
			}),
			madinahHotel: object({
				thumbnail: string(),
				rating: number(),
				name: string(),
				help: string(),
				images: array(string()),
				checkin: date(),
				duration: number(),
				checkout: date(),
				description: string(),
				facilities: array(
					object({
						icon: string(),
						name: string(),
					}),
				),
				map: string(),
				address: string(),
				distance: number(),
				foodType: string(),
				foodAmount: number(),
				foodMenu: array(
					object({
						amount: number(),
						name: string(),
					}),
				),
				review: number(),
			}),
			flight: object({
				thumbnail: string(),
				rating: number(),
				name: string(),
				help: string(),
				images: array(string()),
				certificates: array(
					object({
						image: string(),
						name: string(),
						color: string(),
					}),
				),
				outbound: object({
					departureAirportCode: string(),
					duration: number(),
					arrivalAirportCode: string(),
					schedules: array(
						object({
							takeOff: object({
								datetime: date(),
								airportCity: string(),
								airportCode: string(),
								airportName: string(),
								terminal: string(),
							}),
							duration: number(),
							flightNumber: string(),
							aircraftType: string(),
							baggage: number(),
							cabinBaggage: number(),
							seatLayout: string(),
							landing: object({
								datetime: date(),
								airportCity: string(),
								airportCode: string(),
								airportName: string(),
								terminal: string(),
							}),
							transit: nullable(
								object({
									duration: number(),
									changeAircraft: boolean(),
								}),
							),
						}),
					),
				}),
				inbound: object({
					departureAirportCode: string(),
					duration: number(),
					arrivalAirportCode: string(),
					schedules: array(
						object({
							takeOff: object({
								datetime: date(),
								airportCity: string(),
								airportCode: string(),
								airportName: string(),
								terminal: string(),
							}),
							duration: number(),
							flightNumber: string(),
							aircraftType: string(),
							baggage: number(),
							cabinBaggage: string(),
							seatLayout: string(),
							landing: object({
								datetime: date(),
								airportCity: string(),
								airportCode: string(),
								airportName: string(),
								terminal: string(),
							}),
							transit: nullable(
								object({
									duration: number(),
									changeAircraft: boolean(),
								}),
							),
						}),
					),
				}),
			}),
			bus: object({
				thumbnail: string(),
				name: string(),
				help: string(),
			}),
			schedules: array(
				object({
					day: number(),
					name: string(),
					date: date(),
					agenda: array(
						object({
							datetime: date(),
							description: string(),
							changeTimezoneHere: boolean(),
						}),
					),
				}),
			),
			listOfMuthowif: array(
				object({
					thumbnail: string(),
					name: string(),
					bio: string(),
					detail: string(),
				}),
			),
		}),
	),
});
