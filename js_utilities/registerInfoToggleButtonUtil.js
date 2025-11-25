import Toggle from "ol-ext/control/Toggle";

const InfoAttributes = {
  Information: {
    title: "Information",
    html: '<i class="fa-solid fa-info"></i>',
    modeValue: "info",
  },
  Approve: {
    title: "Building Approve",
    html: '<i class="fa-solid fa-check"></i>',
    modeValue: "approve",
  },
  Delete: {
    title: "Delete Geometry",
    html: '<i class="fa-solid fa-trash"></i>',
    modeValue: "delete",
  },
};

function registerInfoToggleButton(type, parentBar, setMode) {
  const infomativeToggleButton = new Toggle({
    title: InfoAttributes[type].title,
    html: InfoAttributes[type].html,
    onToggle: function (checked) {
      setMode(checked ? InfoAttributes[type].modeValue : "");
    },
  });
  parentBar.addControl(infomativeToggleButton);
}

export default registerInfoToggleButton;
