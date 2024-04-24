/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    return {
        location: params.location
    }
}