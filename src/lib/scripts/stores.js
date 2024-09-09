import { readable, writable } from 'svelte/store';

export const remountSearchbar = writable(0);

export const selectedFeature = writable([]);

export const getMap = writable(() => { });

export const company = writable({});
export const metacorp = writable({});

let getLocation = function() {
    let url = window.location.href;
    return url.slice(url.indexOf('?') + 1).split("location=")[1].split("&")[0];
}
export const getCompany = readable(async (id) => {
    // if (id) is not url id, blast event
    let location = getLocation();
    if (location != id) {
        window
    }
    await fetch("api/companies/" + id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("getting data", data);
            company.set(data);
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
});

export const getMetaCorp = readable(async (id) => {
    await fetch("api/meta/" + id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            metacorp.set(data);
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
});

