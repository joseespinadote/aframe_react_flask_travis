function elementGenerator(
  aScene,
  tipoObjeto,
  position = null,
  rotation = null,
  text = "(empty)",
  item_id = null,
  fecha = null
) {
  if (tipoObjeto == "opcionRepo") {
    let entityEl = document.createElement("a-entity");
    let texto = "align: center; value:" + text + "; color:#FFF; width: 3;";
    position && entityEl.setAttribute("position", position);
    rotation && entityEl.setAttribute("rotation", rotation);
    entityEl.setAttribute("id_artefacto", tipoObjeto);
    item_id && entityEl.setAttribute("id_repo", item_id);
    entityEl.setAttribute("cursor-listener", false);
    entityEl.setAttribute(
      "geometry",
      "primitive: plane; width: 0.9; height: 0.3"
    );
    entityEl.setAttribute("material", "color: #000; side:double");
    entityEl.setAttribute("text", texto);
    aScene.appendChild(entityEl);
  } else if (tipoObjeto == "opcionBuild") {
    let color = text == "passed" ? "green" : text == "failed" ? "red" : "gray";
    let entityBox = document.createElement("a-box");
    position && entityBox.setAttribute("position", position);
    rotation && entityBox.setAttribute("rotation", rotation);
    entityBox.setAttribute("width", "2");
    entityBox.setAttribute("class", "opcionBuild");
    entityBox.setAttribute("height", "0.2");
    entityBox.setAttribute("depth", "2");
    entityBox.setAttribute("material", "color: " + color + "; opacity: 0.8");
    entityBox.setAttribute("cursor-listener", false);
    let entityTitle = document.createElement("a-text");
    entityTitle.setAttribute("value", text);
    entityTitle.setAttribute("position", "-1 0 1");
    entityTitle.setAttribute("rotation", "0 0 0");
    entityTitle.setAttribute("width", "3");
    entityTitle.setAttribute("align", "left");
    let entityDate = document.createElement("a-text");
    entityDate.setAttribute("value", fecha);
    entityDate.setAttribute("position", "0 0 1");
    entityDate.setAttribute("rotation", "0 0 0");
    entityDate.setAttribute("width", "2");
    entityDate.setAttribute("align", "left");
    let entityPin = document.createElement("a-image");
    entityPin.setAttribute("material", "alphaTest: 0.5");
    entityPin.setAttribute("position", "-0.2 0.05 1.01");
    entityPin.setAttribute("rotation", "0 0 90");
    entityPin.setAttribute("scale", "0.2 0.2 0");
    entityPin.setAttribute("src", "#pin");
    entityPin.setAttribute("id_artefacto", "pin");
    entityPin.setAttribute("id_build", item_id);
    entityPin.setAttribute("class", "pin");
    entityPin.setAttribute("cursor-pin", false);
    entityBox.appendChild(entityTitle);
    entityBox.appendChild(entityPin);
    entityBox.appendChild(entityDate);
    aScene.appendChild(entityBox);
  }
}

export default elementGenerator;
