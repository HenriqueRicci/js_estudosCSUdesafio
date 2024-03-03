const api = "https://api.hgbrasil.com/weather?";

const parametros = {
    chave: "ff46800a",
    city_name: "São Paulo"
}

const urlApi = `${api}key=${parametros.chave}&city_name=${parametros.city_name}`;

async function chamadaApi(){
    const response = await fetch (urlApi, {
        method: "GET",
    })

    const dados = await response.json();
    const forecastApi = dados.results.forecast

    const temperadura = forecastApi.slice(0,7).map(dia => dia.max);
    const chuva = forecastApi.slice(0,7).map(dia => dia.rain)
}

chamadaApi()