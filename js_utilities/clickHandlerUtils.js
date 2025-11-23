import { requestService, manageObjectPersistence } from "./serviceUtils";

async function clickHandler(
  event,
  map,
  layers,
  mode,
  informativeDialog,
  featureInformationPopup
) {
  const coordinate = event.coordinate;
  const resolution = map.getView().getResolution();
  const projection = map.getView().getProjection();
  const params = {
    INFO_FORMAT: "application/json",
    FEATURE_COUNT: mode === "info" ? 50 : 1,
  };
  let featurePropertiesInfo = "";
  for (const layer of layers) {
    const featureInfoUrl = layer
      .getSource()
      .getFeatureInfoUrl(coordinate, resolution, projection, params);

    const response = await requestService(featureInfoUrl);
    if (mode === "info") {
      featurePropertiesInfo += manageInfoModeResponse(response);
    } else if (mode === "approve") {
      await manageApproveModeResponse(response, informativeDialog, layer);
    } else if (mode === "delete") {
      await manageDeleteModeResponse(response, informativeDialog, layer);
    }
  }
  if (mode === "info") {
    featureInformationPopup.show(
      coordinate,
      featurePropertiesInfo !== ""
        ? featurePropertiesInfo
        : "<div>No results found</div>"
    );
  }
}

function manageInfoModeResponse(response) {
  let featurePropertyInfo = "";
  if (response.features.length > 0) {
    featurePropertyInfo += "<div><b>Results : </b></div>";
    featurePropertyInfo += response.features.reduce((featureInfo, feature) => {
      let propertiesInfo = "";
      for (let property in feature.properties) {
        propertiesInfo +=
          "<div><b>" +
          property +
          " : </b>" +
          response.features[0].properties[property] +
          "</div>";
      }
      featureInfo += propertiesInfo + "<br>";
      return featureInfo;
    }, "");
  }
  return featurePropertyInfo;
}

async function manageApproveModeResponse(response, informativeDialog, layer) {
  if (response.features.length === 1) {
    const feature = response.features[0];
    if (feature.properties.state_id === 1) {
      informativeDialog.show("The building is already approved");
      return;
    }

    const featureId = feature.id.split(".")[1];
    const params = {
      p_building_id: featureId,
    };
    await manageObjectPersistence(
      "BuildingApprove",
      params,
      layer,
      informativeDialog
    );
  }
}

async function manageDeleteModeResponse(response, informativeDialog, layer) {
  if (response.features.length === 1) {
    const feature = response.features[0];
    const [layer_name, featureId] = feature.id.split(".");
    const params = {
      p_geom_id: featureId,
    };
    let endpointName = "";
    if (layer_name === "buildings") {
      endpointName = "BuildingDeletion";
    } else if (layer_name === "streets") {
      endpointName = "StreetDeletion";
    } else if (layer_name === "points") {
      endpointName = "PointDeletion";
    }
    await manageObjectPersistence(
      endpointName,
      params,
      layer,
      informativeDialog
    );
  }
}

export default clickHandler;
