const API_REQUEST_URL = "http://127.0.0.1:8000/registerBuilding/";

async function api_request(wkt_geometry, building_code, observation) {
  const params = {
    p_wkt: wkt_geometry,
    p_building_cod: building_code,
    p_observation: observation,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };
  const response = await fetch(API_REQUEST_URL, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  });

  return response;
}

export default api_request;
