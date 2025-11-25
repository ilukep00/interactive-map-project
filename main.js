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
import TileWMS from "ol/source/TileWMS.js";

import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import Bar from "ol-ext/control/Bar";
import Dialog from "ol-ext/control/Dialog";
import Popup from "ol-ext/overlay/Popup";

import clickHandler from "./js_utilities/clickHandlerUtils";

import "./style.css";
import registerDrawToggleButton from "./js_utilities/registerDrawToggleButtonsUtils";
import registerInfoToggleButton from "./js_utilities/registerInfoToggleButtonUtil";

let mode = "";
function setMode(value) {
  mode = value;
}

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
  if (mode !== "") {
    const layers =
      mode === "approve"
        ? [buildings_layers]
        : [buildings_layers, streets_layers, points_layers];
    await clickHandler(
      event,
      map,
      layers,
      mode,
      informativeDialog,
      featureInformationPopup
    );
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
registerDrawToggleButton(
  map,
  "Point",
  vectorDrawingLayer,
  drawingBar,
  points_layers,
  informativeDialog
);

// ADDING TOGGLE BUTTON CONTROL FOR DRAW A LINESTRING TO DRAWINGBAR
registerDrawToggleButton(
  map,
  "LineString",
  vectorDrawingLayer,
  drawingBar,
  points_layers,
  informativeDialog
);

// ADDING TOGGLE BUTTON CONTROL FOR DRAW A POLYGON TO DRAWINGBAR
registerDrawToggleButton(
  map,
  "Polygon",
  vectorDrawingLayer,
  drawingBar,
  buildings_layers,
  informativeDialog
);

const infoBar = new Bar({ group: true, toggleOne: true });
mainBar.addControl(infoBar);

// ADDING TOGGLE BUTTON CONTROL FOR GETTING INFORMATION OF A POLYGON
registerInfoToggleButton("Information", infoBar, setMode);

// ADDING TOGGLE BUTTON CONTROL FOR APPROVING A BUILDING
registerInfoToggleButton("Approve", infoBar, setMode);

// ADDING TOGGLE BUTTON CONTROL FOR DELETING A POLYGON
registerInfoToggleButton("Delete", infoBar, setMode);
