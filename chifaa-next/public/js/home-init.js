// Home page init: was an inline <script> in the legacy index.html.
// Boots the MENA map and wires the founder box navigation (was inline onclick).
(function initHome() {
    var worldGeoJSON = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

    var lang = localStorage.getItem('chifaa_lang') || 'en';
    var dataPath = lang === 'ar' ? '/data/menaHealthData_ar.json' : '/data/menaHealthData.json';

    new MenaMap('#mena-map-container', dataPath, worldGeoJSON);

    var box2 = document.querySelector('.box2');
    if (box2) {
        box2.addEventListener('click', function () {
            window.location.href = 'founder.html';
        });
    }
})();
