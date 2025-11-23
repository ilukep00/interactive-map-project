import Toggle from "ol-ext/control/Toggle";
import Draw from "ol/interaction/Draw.js";
import Dialog from "ol-ext/control/Dialog";
import WKT from "ol/format/WKT.js";
import { manageObjectPersistence } from "./serviceUtils";

const GeomAttributes = {
  Point: {
    toggleTittle: "Draw a Point",
    ToggleHtml: '<i class="fa-solid fa-location-dot"></i>',
    formDialogTittle: "Register Point",
    formDialogContent:
      'Point Name: <br/> <input type="text" class="point_name form_input"> <br/>',
    geomType: "Point",
    getParams: getPointParams,
    resetParams: resetPointParams,
  },
  LineString: {
    toggleTittle: "Draw a Line",
    ToggleHtml: '<i class="fa-solid fa-share-nodes"></i>',
    formDialogTittle: "Register Street",
    formDialogContent:
      'Street Name: <br/> <input type="text" class="street_name form_input"> <br/>',
    geomType: "Street",
    getParams: getStreetParams,
    resetParams: resetStreetParams,
  },
  Polygon: {
    toggleTittle: "Draw a Polygon",
    ToggleHtml: '<i class="fa-regular fa-square"></i>',
    formDialogTittle: "Register Building",
    formDialogContent:
      'Building Code: <br/> <input type="text" class="building_code form_input"> <br/> Observation: <br/> <input type="text" class="observation form_input">',
    geomType: "Building",
    getParams: getBuildingParams,
    resetParams: resetBuildingParams,
  },
};

function registerDrawToggleButton(
  map,
  type,
  vectorDrawingLayer,
  parentBar,
  layer,
  informativeDialog
) {
  let wkt_data = "";
  const geomToggleButton = new Toggle({
    title: GeomAttributes[type].toggleTittle,
    html: GeomAttributes[type].ToggleHtml,
    interaction: new Draw({
      type: type,
      source: vectorDrawingLayer.getSource(),
    }),
  });
  parentBar.addControl(geomToggleButton);

  const geomFormDialog = new Dialog({
    title: GeomAttributes[type].formDialogTittle,
    className: "registerForm",
    content: GeomAttributes[type].formDialogContent,
    buttons: { submit: "Accept", cancel: "Cancel" },
  });
  map.addControl(geomFormDialog);

  geomToggleButton.getInteraction().on("drawend", function (event) {
    const wktFormat = new WKT({});
    wkt_data = wktFormat.writeFeature(event.feature, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });
    geomFormDialog.show();
  });

  geomFormDialog.on("button", async function (event) {
    if (event?.button === "submit") {
      const params = GeomAttributes[type].getParams(event, wkt_data);
      await manageObjectPersistence(
        GeomAttributes[type].geomType,
        params,
        layer,
        informativeDialog
      );
    }

    if (event?.button) {
      vectorDrawingLayer.getSource().clear();
      GeomAttributes[type].resetParams(event);
    }
  });
}

function getPointParams(event, wkt_data) {
  const point_name = event.inputs["point_name"]?.value;
  const params = {
    p_wkt: wkt_data,
    p_name: point_name,
  };
  return params;
}

function resetPointParams(event) {
  event.inputs["point_name"].value = "";
}

function getStreetParams(event, wkt_data) {
  const street_name = event.inputs["street_name"]?.value;
  const params = {
    p_wkt: wkt_data,
    p_name: street_name,
  };
  return params;
}

function resetStreetParams(event) {
  event.inputs["street_name"].value = "";
}

function getBuildingParams(event, wkt_data) {
  const building_code = event.inputs["building_code"]?.value;
  const observation = event.inputs["observation"]?.value;

  const params = {
    p_wkt: wkt_data,
    p_building_cod: building_code,
    p_observation: observation,
  };
  return params;
}

function resetBuildingParams(event) {
  event.inputs["building_code"].value = "";
  event.inputs["observation"].value = "";
}

export default registerDrawToggleButton;
