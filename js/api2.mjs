export async function fetchData () {
    const response = fetch('https://desafiotecnico314159265.free.beeceptor.com', {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    return data;
}

