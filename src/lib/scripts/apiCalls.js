export const getFromApi = async (loadFetch, apiUrl, endpoint, siteId) => {
    let queryUrl = `${apiUrl}${endpoint}/${siteId}`;
    return await loadFetch(queryUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            let json = response.json();
            return json
        })
        .then((data) => {
            console.log(`Fetched ${endpoint} ${siteId} from ${queryUrl}`);
            return data
        })
        .catch((error) => {
            console.log(error)
            return {}
        });
        
};