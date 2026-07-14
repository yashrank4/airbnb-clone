// Canonical data contract for the Airbnb listing clone.
// Derived from the reference screenshot. Single source of truth for the shape
// of /data/listing.json. Components import `Listing` from here.

export interface Price {
	amount: number; // 28499
	currency: string; // "INR"
	raw: string; // "₹28,499"
	nights: number; // 5
  }
  
  export interface Capacity {
	guests: number; // 3
	bedrooms: number; // 1
	beds: number; // 1
	baths: number; // 1
  }
  
  export interface PhotoSection {
	section: string; // "Living room 1", "Full kitchen", "Gym", ...
	facilities: string[]; // amenity tags shown under the section heading
	photoCount: number;
	photos: string[]; // absolute or /images/... URLs, ordered
  }
  
  // Flat index into the sectioned photos, used by the hero grid + lightbox counter.
  export interface HeroPhoto {
	url: string;
	alt: string;
	section: string; // which PhotoSection it belongs to
  }
  
  export interface RatingCategories {
	cleanliness: number; // 5.0
	accuracy: number; // 5.0
	checkin: number; // 5.0
	communication: number; // 5.0
	location: number; // 4.8
	value: number; // 4.8
  }
  
  export interface Rating {
	overall: number; // 4.95
	count: number; // 19
	categories: RatingCategories;
  }
  
  export interface Host {
	name: string; // "Mirashya Homes"
	yearsHosting: number; // 2
	superhost: boolean;
	avatar: string;
	reviews: number; // 1463
	rating: number; // 4.68
	bornInThe?: string; // "80s"
	school?: string; // "NICMAR GOA"
	responseRate?: number; // 100
	responseTime?: string; // "Responds within an hour"
  }
  
  export interface CoHost {
	name: string;
	avatar: string;
  }
  
  export interface Highlight {
	icon: string; // icon key
	title: string; // "Outdoor entertainment"
	desc: string;
  }
  
  export interface SleepingArea {
	img: string;
	label: string; // "Bedroom" | "Living room"
	detail: string; // "1 double bed" | "1 sofa"
  }
  
  export interface Amenity {
	label: string; // "Kitchen", "Wifi", ...
	available: boolean; // false = struck-through (e.g. Carbon monoxide alarm)
  }

  export interface AmenityGroupItem extends Amenity {
	icon: string; // Icon name (see components/Icon.tsx)
  }

  // Full amenity list for the "Show all amenities" modal, grouped by category
  // ("Bathroom", "Kitchen and dining", ...). The flat `amenities` above is the
  // shorter preview shown on the page.
  export interface AmenityGroup {
	title: string;
	items: AmenityGroupItem[];
  }

  export interface Review {
	name: string;
	avatar: string;
	timeOnAirbnb: string; // "2 months on Airbnb" | "3 years on Airbnb"
	date: string; // "1 week ago" | "May 2026"
	stars: number; // 5
	text: string;
  }
  
  export interface ThingsToKnow {
	cancellation: string[];
	houseRules: string[];
	safety: string[];
  }

  export interface StayMonth {
	year: number; // 2026
	month: number; // 1-12
	label: string; // "October 2026"
  }

  // The pre-selected stay shown in the calendar section.
  export interface Stay {
	nights: number; // 5
	location: string; // "Candolim"
	checkIn: string; // ISO date "2026-10-18"
	checkOut: string; // ISO date "2026-10-23"
	rangeLabel: string; // "18 Oct 2026 - 23 Oct 2026"
	months: StayMonth[];
  }

  // Keyword chips summarising what guests mention in reviews.
  export interface ReviewTag {
	label: string; // "Comfort"
	count: number; // 6
	icon: string; // Icon name (see components/Icon.tsx)
  }

  // A card in the "More stays nearby" carousel at the foot of the page.
  export interface NearbyStay {
	img: string;
	title: string; // "Beautiful Studio with a view to die for"
	price: string; // "₹23,600"
	rating: number; // 4.91
  }

  export interface Listing {
	title: string; // "Romantic Jacuzzi 1BHK Candolim | Mirashya UG10"
	location: string; // "Candolim, Goa, India"
	price: Price;
	capacity: Capacity;
	photoSections: PhotoSection[]; // full photo tour, grouped by area (43 photos)
	heroPhotos: HeroPhoto[]; // the 5 shown in the listing hero collage
	totalPhotos: number; // 43
	baseImageUrl: string; // asset base if photos are stored relative
	rating: Rating;
	host: Host;
	coHosts: CoHost[];
	highlights: Highlight[];
	sleeping: SleepingArea[];
	amenities: Amenity[];
	amenitiesTotal: number; // 50
	amenityGroups: AmenityGroup[]; // full categorized list for the modal
	reviews: Review[];
	reviewTags: ReviewTag[]; // keyword chips in the reviews section
	stay: Stay; // pre-selected dates for the calendar section
	nearbyStays: NearbyStay[]; // "More stays nearby" carousel
	description: string;
	thingsToKnow: ThingsToKnow;
	neighbourhood: string; // "Located in the heart of Candolim..."
	_unresolved: string[]; // fields not confidently read from the reference
  }