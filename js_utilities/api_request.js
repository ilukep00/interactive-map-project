const API_OBJECTS_URL = {
  Street: "http://127.0.0.1:8000/registerStreet/",
  Building: "http://127.0.0.1:8000/registerBuilding/",
};

async function doApiCall(params, url) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };
  const response = await fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  });

  return response;
}

async function manageObjectPersistence(
  objectType,
  params,
  layerToAddObject,
  informativeDialog
) {
  let successresponse = true;
  try {
    await doApiCall(params, API_OBJECTS_URL[objectType]);
  } catch (error) {
    successresponse = false;
  }

  if (successresponse) {
    const params = layerToAddObject.getSource().getParams();
    params.creationDate = new Date();
    layerToAddObject.getSource().updateParams(params);
  }
  informativeDialog.show(
    successresponse
      ? "The " + objectType + " has been registered correctly"
      : "Some error when registering the " + objectType
  );
}

export { manageObjectPersistence };
