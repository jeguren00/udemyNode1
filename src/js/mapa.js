(function() {
    const lat = document.querySelector('#lat').value || 20.67444163271174;
    const lng = document.querySelector('#lon').value || -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService()
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //movement
    marker.on('moveend', function(e) {
        marker = e.target
        const position = marker.getLatLng()
        mapa.panTo(new L.latLng(position.lat, position.lng))

        geocodeService.reverse().latlng(position,13).run(function(err, result){
            marker.bindPopup(result.address.LongLabel)
            document.querySelector('.calle').textContent = result.address.Address ?? ''
            document.querySelector('#street').value = result.address.Address ?? ''
            document.querySelector('#lat').value = result.latlng.lat ?? ''
            document.querySelector('#lon').value = result.latlng.lng ?? ''
        })
    })
})()