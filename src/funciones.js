export function showLoading(aScene) {
  let entityEl = document.createElement("a-entity");
  let texto = "align: center; value:Loading...; color:#FFF; width: 4;";
  entityEl.setAttribute("position", " 0 1.65 -0.7");
  entityEl.setAttribute("geometry", "primitive: plane; width: 1; height: 0.45");
  entityEl.setAttribute("material", "color: #000; side:double; opacity:0.7");
  entityEl.setAttribute("text", texto);
  entityEl.setAttribute("class", "loading");
  aScene.appendChild(entityEl);
}
export function hideLoading(aScene) {
  let els = aScene.querySelectorAll(".loading");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.parentNode.removeChild(element);
  }
}
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
    entityEl.setAttribute("id", tipoObjeto);
    item_id && entityEl.setAttribute("id_repo", item_id);
    entityEl.setAttribute("click-component", false);
    entityEl.setAttribute(
      "geometry",
      "primitive: plane; width: 0.9; height: 0.3"
    );
    entityEl.setAttribute("material", "color: #000; side:double");
    entityEl.setAttribute("text", texto);
    entityEl.setAttribute("class", "clickable");
    aScene.appendChild(entityEl);
  } else if (tipoObjeto == "opcionBuild") {
    let color = text == "passed" ? "green" : text == "failed" ? "red" : "gray";
    let entityBox = document.createElement("a-box");
    position && entityBox.setAttribute("position", position);
    rotation && entityBox.setAttribute("rotation", rotation);
    entityBox.setAttribute("width", "2");
    entityBox.setAttribute("class", "clickable");
    entityBox.setAttribute("height", "0.2");
    entityBox.setAttribute("depth", "2");
    entityBox.setAttribute("material", "color: " + color + "; opacity: 0.8");
    entityBox.setAttribute("click-component", false);
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

export function repoOptionsGenerator(aScene, repos) {
  let position = { x: 0, y: 0, z: 0 };
  let rotation = { x: 0, y: 0, z: 0 };
  let numBoxInRow = 8;
  let counter = 0;
  let numRows = 0;
  repos.repositories.map((item, index) => {
    if (!item.active) return;
    if (counter > numBoxInRow) {
      counter = 0;
      numRows += 1;
    }
    position.x = counter - numBoxInRow / 2;
    position.y = 0.3 + numRows / 3;
    position.z = Math.cos(Math.abs(position.x / numBoxInRow) * Math.PI) * -2.5;
    rotation.y = position.x * -15;
    counter += 1;
    let texto = item.name.substring(0, 15);
    texto = texto == item.name ? texto : texto + "...";
    if (texto.length > 8)
      texto = texto.substring(0, 8) + "\n " + texto.substring(9, texto.length);
    elementGenerator(aScene, "opcionRepo", position, rotation, texto, item.id);
  });
}

export function buildOptionsGenerator(aScene, repoTree) {
  let els = aScene.querySelectorAll(".opcionBuild");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.parentNode.removeChild(element);
  }
  let position = { x: -1.5, y: 0.5, z: -2.2 };
  let rotation = { x: 0, y: 15, z: 0 };

  repoTree.builds &&
    repoTree.builds.map((item, index) => {
      let texto1 = item.state;
      let texto2 = item.started_at;
      elementGenerator(
        aScene,
        "opcionBuild",
        position,
        rotation,
        texto1,
        item.id,
        texto2
      );
      position.y += 0.21;
    });
}
