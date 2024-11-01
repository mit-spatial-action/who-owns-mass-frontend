import { readable, writable } from 'svelte/store';

export const remountSearchbar = writable(0);

export const selectedFeature = writable([]);

export const getMap = writable(() => { });

export const company_id = writable({});
export const company = writable({});
export const metacorp = writable({});
export const site = writable({});
export const loadState = writable(true)
export const infoMode = writable("home")

// let getLocation = function() {
//     let url = window.location.href;
//     return url.slice(url.indexOf('?') + 1).split("location=")[1].split("&")[0];
// }

export const getSite = readable(async (site_id) => {
    // if (id) is not url id, blast event
    // let location = getLocation();
    // if (location != site_id) {
    //     window
    // }
    loadState.set(true);
    await fetch("api/site/" + site_id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("SITE");
            console.log(data);
            site.set(data);
            loadState.set(false);
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
});

export const getMetaCorp = readable(async (meta_id) => {
    loadState.set(true);
    await fetch("api/meta/" + meta_id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("store js, getMetaCorp", data);
            metacorp.set(data);
            loadState.set(false);
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
});

