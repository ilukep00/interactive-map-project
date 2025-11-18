const API_OBJECTS_URL = {
  Street: "http://127.0.0.1:8000/registerStreet/",
  Building: "http://127.0.0.1:8000/registerBuilding/",
  BuildingApprove: "http://127.0.0.1:8000/buildingApprove/",
  Point: "http://127.0.0.1:8000/registerPoint/",
};

const MESSAGES = {
  Street: {
    success: "The Street has been registered correctly",
    error: "Some error when registering the Street",
  },
  Building: {
    success: "The Building has been registered correctly",
    error: "Some error when registering the Building",
  },
  BuildingApprove: {
    success: "The Building has been approved correctly",
    error: "Some error when approving the Building",
  },
  Point: {
    success: "The Point has been registered correctly",
    error: "Some error when registering the Point",
  },
};

async function requestService(url, options = {}) {
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
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };
    const response = await requestService(API_OBJECTS_URL[objectType], options);
    if (response.length === 0) {
      successresponse = false;
    }
  } catch (error) {
    successresponse = false;
  }

  if (successresponse) {
    const params = layerToAddObject.getSource().getParams();
    params.creationDate = new Date();
    layerToAddObject.getSource().updateParams(params);
  }
  informativeDialog.show(
    successresponse ? MESSAGES[objectType].success : MESSAGES[objectType].error
  );
}

export { manageObjectPersistence, requestService };
