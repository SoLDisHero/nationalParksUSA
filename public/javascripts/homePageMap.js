mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//   container: 'map', // container ID
//   style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
//   center: [-104.269777, 38.392446], // Default center coordinates
//   zoom: 2, // Default zoom level
// });

// map.on('load', () => {
//     // Load your custom icon image
//     map.loadImage("/pictures/pine-tree.png", (error, image) => {
//       if (error) throw error;
  
//       // Add the custom icon image to the map style with a unique image ID
//       map.addImage('custom-icon', image);
//     });
//   });

// // Loop through your parksAll array and add markers for each park
// parksAll.forEach((parkOne, index) => {
//   new mapboxgl.Marker()
//     .setLngLat(parkOne.geometry.coordinates)
//     .setPopup(
//       new mapboxgl.Popup({ offset: 25 })
//         .setHTML(
//           `<a href="parks/${parkOne._id}">${parkOne.title}</a>`
//         )
//     )
//     .addTo(map);
// });

const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-104.269777, 38.392446],
    zoom: 2
    });
parksAll.forEach(onePark => {

    
const geojson = {
    'type': 'FeatureCollection',
    'features': [
    {
    'type': 'Feature',
    'properties': {
    'message': 'Foo',
    'iconSize': [25, 25]
    },
    'geometry': {
    'type': 'Point',
    'coordinates': onePark.geometry.coordinates
    }
    }
    ]
};

    
     
    // Add markers to the map.
    for (const marker of geojson.features) {
    // Create a DOM element for each marker.
    const el = document.createElement('div');
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = 'marker';
    el.style.backgroundImage = `url("/pictures/pine-tree.png")`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
     
    // Add markers to the map.
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          onePark.properties.popUpMarkup
        )
    )
    .addTo(map);
    }
})