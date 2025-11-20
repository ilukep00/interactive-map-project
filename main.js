import Map from "ol/Map.js";
import View from "ol/View.js";
import { fromLonLat } from "ol/proj";
import LayerGroup from "ol/layer/Group.js";
import TileLayer from "ol/layer/Tile.js";
import OSM from "ol/source/OSM.js";
import XYZ from "ol/source/XYZ.js";
import FullScreen from "ol/control/FullScreen.js";
import ZoomToExtent from "ol/control/ZoomToExtent.js";
import MousePosition from "ol/control/MousePosition.js";
import { createStringXY } from "ol/coordinate";
import ScaleLine from "ol/control/ScaleLine.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Draw from "ol/interaction/Draw.js";
import WKT from "ol/format/WKT.js";
import TileWMS from "ol/source/TileWMS.js";

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import Bar from "ol-ext/control/Bar";
import Toggle from "ol-ext/control/Toggle";
import Dialog from "ol-ext/control/Dialog";
import Popup from "ol-ext/overlay/Popup";

import {
  manageObjectPersistence,
  requestService,
} from "./js_utilities/serviceUtils";

import "./style.css";

let wkt_data;
let mode = "";

const buildings_layers = new TileLayer({
  source: new TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {
      VERSION: "1.1.1",
      LAYERS: "project_ol:buildings",
      STYLES: "style_buildings",
    },
  }),
  title: "Buildings",
});

const streets_layers = new TileLayer({
  source: new TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {
      VERSION: "1.1.1",
      LAYERS: "project_ol:streets",
      STYLES: "style_streets",
    },
  }),
  title: "Streets",
});

const points_layers = new TileLayer({
  source: new TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: {
      VERSION: "1.1.1",
      LAYERS: "project_ol:points",
    },
  }),
  title: "Points",
});

const baseLayers = new LayerGroup({
  title: "Base Layers",
  openInLayerSwitcher: true,
  layers: [
    new TileLayer({
      source: new OSM(),
      title: "OSM",
      visible: true,
      baseLayer: true,
    }),
    new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
      }),
      title: "Google Maps",
      visible: false,
      baseLayer: true,
    }),
    new TileLayer({
      source: new XYZ({
        url: "https://www.google.cn/maps/vt?lyrs=s@189&gl=cr&x={x}&y={y}&z={z}",
      }),
      title: "Google Maps Satellite",
      visible: false,
      baseLayer: true,
    }),
  ],
});

const map = new Map({
  target: "map",
  layers: [baseLayers, buildings_layers, streets_layers, points_layers],
  view: new View({
    center: fromLonLat([-1.6389912, 42.8171412]),
    zoom: 17,
  }),
});

const featureInformationPopup = new Popup({
  closeBox: true,
});
map.addOverlay(featureInformationPopup);

const informativeDialog = new Dialog({ hideOnClick: true });
map.addControl(informativeDialog);

map.on("singleclick", async function (event) {
  if (mode === "info") {
    const coordinate = event.coordinate;
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    const params = { INFO_FORMAT: "application/json", FEATURE_COUNT: 50 };

    const layers = [buildings_layers, streets_layers, points_layers];
    let featurePropertiesInfo = "";
    for (const layer of layers) {
      const featureInfoUrl = layer
        .getSource()
        .getFeatureInfoUrl(coordinate, resolution, projection, params);

      const response = await requestService(featureInfoUrl);

      if (response.features.length > 0) {
        featurePropertiesInfo += "<div><b>Results : </b></div>";
        featurePropertiesInfo += response.features.reduce(
          (featureInfo, feature) => {
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
          },
          ""
        );
      }
    }
    featureInformationPopup.show(
      coordinate,
      featurePropertiesInfo !== ""
        ? featurePropertiesInfo
        : "<div>No results found</div>"
    );
  } else if (mode === "approve") {
    const coordinate = event.coordinate;
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    const params = { INFO_FORMAT: "application/json", FEATURE_COUNT: 1 };
    const featureInfoUrl = buildings_layers
      .getSource()
      .getFeatureInfoUrl(coordinate, resolution, projection, params);
    const response = await requestService(featureInfoUrl);
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
        buildings_layers,
        informativeDialog
      );
    }
  } else if (mode === "delete") {
    const coordinate = event.coordinate;
    const resolution = map.getView().getResolution();
    const projection = map.getView().getProjection();
    const params = { INFO_FORMAT: "application/json", FEATURE_COUNT: 1 };
    const layers = [buildings_layers, streets_layers, points_layers];
    for (const layer of layers) {
      const featureInfoUrl = layer
        .getSource()
        .getFeatureInfoUrl(coordinate, resolution, projection, params);
      const response = await requestService(featureInfoUrl);
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
  }
});

//ADDING BASE LAYER SWITCHER CONTROL TO MAP
const baseLayerSwitcher = new LayerSwitcher({});
map.addControl(baseLayerSwitcher);

//ADDING MOUSE POSITION CONTROL TO MAP
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
});
map.addControl(mousePositionControl);

//ADDING SCALE LINE CONTROL TO MAP
const scaleLineControl = new ScaleLine({});
map.addControl(scaleLineControl);

// ADDING MAIN BAR CONTROL TO MAP
const mainBar = new Bar({});
mainBar.setPosition("left-top");
map.addControl(mainBar);

// BASIC BAR CONTROL TO MAIN BAR
const basicBar = new Bar({ group: true });
mainBar.addControl(basicBar);

// ADDING FULL SCREEN CONTROL TO BASIC BAR
const fullScreenControl = new FullScreen({});
basicBar.addControl(fullScreenControl);

// ADDING ZOOM TO EXTEND CONTROL TO BASIC BAR
const zoomToExtendControl = new ZoomToExtent({
  extent: [
    -182569.87101839684, 5283901.79972453, -182516.09751992754,
    5284401.086352228,
  ],
});
basicBar.addControl(zoomToExtendControl);

// ADDING DRAWING BAR TO MAIN BAR
const drawingBar = new Bar({ group: true, toggleOne: true });
mainBar.addControl(drawingBar);

// CREATING VECTOR LAYER FOR THE DRAWINGS
const vectorDrawingLayer = new VectorLayer({
  source: new VectorSource({}),
  displayInLayerSwitcher: false,
});
map.addLayer(vectorDrawingLayer);

// ADDING TOGGLE BUTTON CONTROL FOR DRAW A POINT TO DRAWINGBAR
const pointToggleButton = new Toggle({
  title: "Draw a Point",
  html: '<i class="fa-solid fa-location-dot"></i>',
  interaction: new Draw({
    type: "Point",
    source: vectorDrawingLayer.getSource(),
  }),
});
drawingBar.addControl(pointToggleButton);

const pointFormDialog = new Dialog({
  title: "Register Point",
  className: "registerPoint",
  content:
    'Point Name: <br/> <input type="text" class="point_name form_input"> <br/>',
  buttons: { submit: "Accept", cancel: "Cancel" },
});
map.addControl(pointFormDialog);

pointFormDialog.on("button", async function (event) {
  if (event?.button === "submit") {
    const point_name = event.inputs["point_name"]?.value;
    const params = {
      p_wkt: wkt_data,
      p_name: point_name,
    };
    await manageObjectPersistence(
      "Point",
      params,
      points_layers,
      informativeDialog
    );
  }

  if (event?.button) {
    vectorDrawingLayer.getSource().clear();
    event.inputs["point_name"].value = "";
  }
});

// ADDING TOGGLE BUTTON CONTROL FOR DRAW A LINESTRING TO DRAWINGBAR
const lineToggleButton = new Toggle({
  title: "Draw a Line",
  html: '<i class="fa-solid fa-share-nodes"></i>',
  interaction: new Draw({
    type: "LineString",
    source: vectorDrawingLayer.getSource(),
  }),
});
drawingBar.addControl(lineToggleButton);

const streetFormDialog = new Dialog({
  title: "Register Street",
  className: "registerForm",
  content:
    'Street Name: <br/> <input type="text" class="street_name form_input"> <br/>',
  buttons: { submit: "Accept", cancel: "Cancel" },
});
map.addControl(streetFormDialog);

streetFormDialog.on("button", async function (event) {
  if (event?.button === "submit") {
    const street_name = event.inputs["street_name"]?.value;
    const params = {
      p_wkt: wkt_data,
      p_name: street_name,
    };
    await manageObjectPersistence(
      "Street",
      params,
      streets_layers,
      informativeDialog
    );
  }

  if (event?.button) {
    vectorDrawingLayer.getSource().clear();
    event.inputs["street_name"].value = "";
  }
});

// ADDING TOGGLE BUTTON CONTROL FOR DRAW A POLYGON TO DRAWINGBAR
const polygonToggleButton = new Toggle({
  title: "Draw a Polygon",
  html: '<i class="fa-regular fa-square"></i>',
  interaction: new Draw({
    type: "Polygon",
    source: vectorDrawingLayer.getSource(),
  }),
});
drawingBar.addControl(polygonToggleButton);

const buildingFormDialog = new Dialog({
  title: "Register Building",
  className: "registerForm",
  content:
    'Building Code: <br/> <input type="text" class="building_code form_input"> <br/> Observation: <br/> <input type="text" class="observation form_input">',
  buttons: { submit: "Accept", cancel: "Cancel" },
});
map.addControl(buildingFormDialog);

buildingFormDialog.on("button", async function (event) {
  if (event?.button === "submit") {
    const building_code = event.inputs["building_code"]?.value;
    const observation = event.inputs["observation"]?.value;

    const params = {
      p_wkt: wkt_data,
      p_building_cod: building_code,
      p_observation: observation,
    };
    await manageObjectPersistence(
      "Building",
      params,
      buildings_layers,
      informativeDialog
    );
  }

  if (event?.button) {
    vectorDrawingLayer.getSource().clear();
    event.inputs["building_code"].value = "";
    event.inputs["observation"].value = "";
  }
});

function getDrawDone(event, type) {
  console.log(event);
  const wktFormat = new WKT({});
  wkt_data = wktFormat.writeFeature(event.feature, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  if (type === "Polygon") {
    buildingFormDialog.show();
  } else if (type === "LineString") {
    streetFormDialog.show();
  } else {
    pointFormDialog.show();
  }
}

pointToggleButton.getInteraction().on("drawend", function (event) {
  getDrawDone(event, "Point");
});
lineToggleButton.getInteraction().on("drawend", function (event) {
  getDrawDone(event, "LineString");
});
polygonToggleButton.getInteraction().on("drawend", function (event) {
  getDrawDone(event, "Polygon");
});

const infoBar = new Bar({ group: true, toggleOne: true });
mainBar.addControl(infoBar);

const infomativeToggleButton = new Toggle({
  title: "Information",
  html: '<i class="fa-solid fa-info"></i>',
  onToggle: function (checked) {
    mode = checked ? "info" : "";
  },
});
infoBar.addControl(infomativeToggleButton);

const buildingApproveToggleButton = new Toggle({
  title: "Building Approve",
  html: '<i class="fa-solid fa-check"></i>',
  onToggle: function (checked) {
    mode = checked ? "approve" : "";
  },
});
infoBar.addControl(buildingApproveToggleButton);

const deleteToggleButton = new Toggle({
  title: "Delete Geometry",
  html: '<i class="fa-solid fa-trash"></i>',
  onToggle: function (checked) {
    mode = checked ? "delete" : "";
  },
});
infoBar.addControl(deleteToggleButton);
