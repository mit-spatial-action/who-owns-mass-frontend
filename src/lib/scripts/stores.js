import { readable, writable } from 'svelte/store';

export const remountSearchbar = writable(0);

export const selectedFeature = writable([]);

export const getMap = writable(() => { });

export const company = writable({});

export const getCompany = readable(async (id) => {
    console.log("getCompany in storejs");
    await fetch("api/companies/" + id + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("get company in storejs", data)
            company.set(data);
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
});

