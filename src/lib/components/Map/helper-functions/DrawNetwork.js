/* Helper function draws network from selected geometry to all other points in its network
    - Origin: coordinate in format [lng,lat]
    - Destinations: coordinate in format [{lat,lng}, {lat,lng}...]. Hardcoded for now
*/ 

//Note: for now, using arrays for coordinates. Will need to add a processing step to parse geojson company inputs.
const exampleDestinations= [[-72.0287275314331 , 42.30118247546122],
                        [-71.27483367919922 , 42.32149339167387],
                        [-71.1650562286377 , 42.21879268234491],
                        [-70.99124908447266 , 42.37179813315248],
                        [-71.1203384399414 , 42.39772771799201],
                        [-71.11630439758301 , 42.31171958136474]]

//TODO: add "destination" param
export function drawNetwork (origin) {
    const routes = {
        'type': 'FeatureCollection',
        'features': []
    };

    for (let i = 0; i < exampleDestinations.length; i++) {
        let route = 
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [origin, exampleDestinations[i]]
                }
            }  
            
    routes.features.push(route);
    };
    return(routes);

}

export function drawNetworkPoints() {

    const points = {
        'type': 'FeatureCollection',
        'features': []
    };

    for (let i = 0; i < exampleDestinations.length; i++) {
        let affiliate = 
            {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'Point',
                    'coordinates': exampleDestinations[i]
                }
            }  
            
    points.features.push(affiliate);
    };
    return(points)
}
