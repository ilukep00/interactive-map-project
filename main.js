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

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import Bar from "ol-ext/control/Bar";
import Toggle from "ol-ext/control/Toggle";
import Dialog from "ol-ext/control/Dialog";

import "./style.css";

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
  layers: [baseLayers],
  view: new View({
    center: fromLonLat([-1.6389912, 42.8171412]),
    zoom: 17,
  }),
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
  className: "registerBuilding",
  content:
    'Building Code: <br/> <input type="text" class="building_code building_input"> <br/> Observation: <br/> <input type="text" class="observation building_input">',
  buttons: { submit: "Accept", cancel: "Cancel" },
});
map.addControl(buildingFormDialog);

buildingFormDialog.on("button", function (event) {
  if (event?.button === "submit") {
    const building_code = event.inputs["building_code"]?.value;
    const observation = event.inputs["observation"]?.value;

    console.log("Building code: ", building_code);
    console.log("Observation: ", observation);

    // CALL TO THE API HERE
  }
});

function getDrawDone(event) {
  console.log(event);
  const wktFormat = new WKT({});
  const data = wktFormat.writeFeature(event.feature, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:2857",
  });
  buildingFormDialog.show();
  console.log(data);
}

pointToggleButton.getInteraction().on("drawend", getDrawDone);
lineToggleButton.getInteraction().on("drawend", getDrawDone);
polygonToggleButton.getInteraction().on("drawend", getDrawDone);
