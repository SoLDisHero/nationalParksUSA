mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
    center: parksAll[4].geometry.coordinates, // starting position [lng, lat]
    zoom: 3, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(parksAll.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${parksAll[0].title}</h3>`
    )
)
.addTo(map);