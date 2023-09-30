import img from './images/img2.jpg';
import { AiFillDashboard } from 'react-icons/ai';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaUsersLine } from 'react-icons/fa6';
import { MdPreview } from 'react-icons/md';
import { GiLockedFortress } from 'react-icons/gi';
import { FaLandmark } from 'react-icons/fa';
import { MdTour } from 'react-icons/md';
 
export const host_url = 'http://localhost:8000';

export const items = [
  {
    id: 1,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  },
  {
    id: 2,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  },
  {
    id: 3,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX',
  },
  {
    id: 4,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  },
  {
    id: 5,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  },
  {
    id: 6,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  },
  {
    id: 7,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX',
  },
  {
    id: 8,
    imgSrc: img,
    destTitle: 'Machu Picchu',
    location: 'Peru',
    grade: 'CULTURAL RELAX'
  }
]

export const categories = ["All", "Museum", "Fortress", "Sites Naturels", "Artificial sites", "Music"]

export const MAPBOX_TOKEN = 'pk.eyJ1IjoiYWJkZXNzYW1hZDE5OTkiLCJhIjoiY2xsMHJybmYyMGhxbjNqcXJtb3A3NHRqZCJ9.IHwgA8z_Ov4lac-Nld3jDA';

export const settingsArticle = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  // autoplay: true,
  // autoplaySpeed: 3000,
}

export const settingsPopular = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  arrows: false,
  // autoplay: true,
  // autoplaySpeed: 30000,
  responsive: [

    {
      breakpoint: 990,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2
      }
    },
    {
      breakpoint: 530,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

export const offers = [
  {
    list_items: [
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbb8",
        name: "Museum of Cinema",
        Latitude: 30.921983,
        Longitude: -6.899429
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbc9",
        name: "Oasis Museum",
        Latitude: 31.853383,
        Longitude: -5.098874
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbd6",
        name: "Es-Sifa Glagla",
        Latitude: 31.346829,
        Longitude: -4.333483
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbde",
        name: "Ksar d'Amezrou",
        Latitude: 30.315683,
        Longitude: -5.829382
      }
    ],
    categories: [{"Museum": <FaLandmark className='icon'/>},{"Fortress": <GiLockedFortress className='icon'/>}]
  },
  {
    list_items: [
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbb8",
        name: "Museum of Cinema",
        Latitude: 30.921983,
        Longitude: -6.899429
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbc9",
        name: "Oasis Museum",
        Latitude: 31.853383,
        Longitude: -5.098874
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbd6",
        name: "Es-Sifa Glagla",
        Latitude: 31.346829,
        Longitude: -4.333483
      },
      {
        _id: "64e0a2a3a8e3dd2ce2fcfbf5",
        name: "Barrage Al-Hassan Addakhil",
        Latitude: 32.000174,
        Longitude: -4.464804
      }
    ],
    categories: [{"Museum": <FaLandmark className='icon'/>},{"Fortress": <GiLockedFortress className='icon'/>},{"Artificial sites": <MdTour className='icon'/>}]
  },
  {
    list_items: [
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbb8",
        name: "Museum of Cinema",
        Latitude: 30.921983,
        Longitude: -6.899429
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbd6",
        name: "Es-Sifa Glagla",
        Latitude: 31.346829,
        Longitude: -4.333483
      },
      {
        _id: "64e0a2a2a8e3dd2ce2fcfbde",
        name: "Ksar d'Amezrou",
        Latitude: 30.315683,
        Longitude: -5.829382
      }
    ],
    categories: [{"Museum": <FaLandmark className='icon'/>},{"Fortress": <GiLockedFortress className='icon'/>}]
  }
]

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: <AiFillDashboard className="icon" />,
    path: "/dashboard"
  },
  {
    title: "Items",
    icon: <FaMapMarkerAlt className="icon" />,
    path: "/dashboard/items"
  },
  // {
  //   title: "Users",
  //   icon: <AiFillDashboard className="icon" />,
  //   childrens: [
  //     {
  //       title: "Reviews",
  //       icon: <AiFillDashboard className="icon" />,
  //       path: "/"
  //     },
  //     {
  //       title: "Dashboard",
  //       icon: <AiFillDashboard className="icon" />,
  //       path: "/"
  //     },
  //     {
  //       title: "Dashboard",
  //       icon: <AiFillDashboard className="icon" />,
  //       path: "/"
  //     }
  //   ]
  // },
  {
    title: "Users",
    icon: <FaUsersLine className="icon" />,
    path: "/dashboard/users"
  },
  {
    title: "Reviews",
    icon: <MdPreview className="icon" />,
    path: "/dashboard/reviews"
  }
]

export const categoriesItem = ["Pizza" ,"Distilleries" ,"Fitness & Instruction" ,"Home Decor" ,"Convenience Stores" ,
"Shopping" ,"Community Service/Non-Profit" ,"Bed & Breakfast" ,"Summer Camps" ,"Restaurants" ,"Hiking" ,"Observatories" ,
"Paddleboarding" ,"Golf" ,"Cultural Center" ,"Landmarks & Historical Buildings" ,"Wine Tasting Room" ,"Notaries" ,
"Mediterranean" ,"Travel Services" ,"Pumpkin Patches" ,"Mags" ,"American (New)" ,"Apartments" ,"Books" ,"Home & Garden" ,
"Art Tours" ,"Museums" ,"Amusement Parks" ,"Skating Rinks" ,"Insurance" ,"Recording & Rehearsal Studios" ,"Arts & Crafts" ,
"Art Galleries" ,"Festivals" ,"Arts & Entertainment" ,"Breakfast & Brunch" ,"Steakhouses" ,"Wedding Planning" ,"Legal Services" ,
"Food" ,"Architectural Tours" ,"Attraction Farms" ,"Local Flavor" ,"Art Museums" ,"Active Life" ,"Wineries" ,"Boat Tours" ,"Irrigation" ,
"Barbeque" ,"Bars" ,"Airports" ,"Kids Activities" ,"Party & Event Planning" ,"Breweries" ,"Performing Arts" ,"Venues & Event Spaces" ,
"Religious Organizations" ,"Hotels & Travel" ,"Tours" ,"Departments of Motor Vehicles" ,"Bridal" ,"Public Markets" ,"Walking Tours" ,
"Escape Games" ,"Professional Services" ,"Registration Services" ,"Churches" ,"Landscaping" ,"Nightlife" ,"Local Services" ,"Diners" ,
"Libraries" ,"Visitor Centers" ,"Shopping Centers" ,"Toy Stores" ,"Automotive" ,"Lounges" ,"Public Transportation" ,"Contractors" ,
"Commercial Real Estate" ,"Home Services" ,"American (Traditional)" ,"Seafood" ,"Ticket Sales" ,"Jewelry" ,"Italian" ,
"Bookstores" ,"Wedding Chapels" ,"Zoos" ,"Cocktail Bars" ,"Middle Schools & High Schools" ,"Salad" ,"Parks" ,
"Funeral Services & Cemeteries" ,"Event Planning & Services" ,"Music Venues" ,"Caterers" ,"Real Estate" ,"Tree Services" ,
"Historical Tours" ,"Marinas" ,"Education" ,"Transportation" ,"Ice Cream & Frozen Yogurt" ,"Burgers" ,"Financial Services" ,
"Hotels" ,"Botanical Gardens" ,"Tennis" ,"Farmers Market" ,"Artificial Turf" ,"Planetarium" ,"Elementary Schools" ,
"Souvenir Shops" ,"Masonry/Concrete" ,"Meditation Centers" ,"Courthouses" ,"Music & Video" ,"Public Services & Government" ,"Farms"]