mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
    center: parksAll.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

new mapboxgl.Marker()
.setLngLat(parksAll.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h5>${parksAll.title}</h5>`
    )
)
.addTo(map);