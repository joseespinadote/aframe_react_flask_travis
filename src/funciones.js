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
    entityEl.setAttribute("position", position);
    entityEl.setAttribute(
      "animation",
      "property: position; from: " +
        position.x.toFixed(3) +
        " " +
        position.y.toFixed(3) +
        " " +
        position.z.toFixed(3) +
        "; to: 0 1.5 -4; dur: 1000; easing: linear; dir: reverse;"
    );
    entityEl.setAttribute("rotation", rotation);
    entityEl.setAttribute("id_objeto", tipoObjeto);
    entityEl.setAttribute("id_repo", item_id);
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
    entityBox.setAttribute("click-component", false);
    entityBox.setAttribute("height", "0.2");
    entityBox.setAttribute("depth", "2");
    entityBox.setAttribute("material", "color: " + color + "; opacity: 0.8");
    entityBox.setAttribute("id_build", item_id);
    entityBox.setAttribute("id_objeto", tipoObjeto);
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
    entityBox.appendChild(entityTitle);
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
  let els = aScene.querySelectorAll("[id_build]");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.parentNode.removeChild(element);
  }
  els = aScene.querySelectorAll("[id_repo]");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.setAttribute("animation", "dir", "normal");
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

export function errorsGenerator(aScene, errores) {
  var els = aScene.querySelectorAll(".log");
  for (var i = els.length - 1; i >= 0; i--) {
    let element = els[i];
    element.parentNode.removeChild(element);
  }
  let counter = 0.3;
  if (errores.length == 0) {
    let entityText = document.createElement("a-entity");
    let currentText = "No errors!";
    entityText.setAttribute(
      "text",
      "align:center;width:1.2;value:" + currentText
    );
    entityText.setAttribute("position", "2 1 0");
    counter += 0.51;
    entityText.setAttribute(
      "geometry",
      "primitive: plane; height: 0.5; width: 1.2"
    );
    entityText.setAttribute("material", "color: red");
    entityText.setAttribute("rotation", "0 -80 0");
    entityText.setAttribute("class", "log");
    aScene.appendChild(entityText);
  } else {
    errores.map((item, index) => {
      let entityText = document.createElement("a-entity");
      let currentText = item;
      entityText.setAttribute(
        "text",
        "align:center;width:1.2;value:" + currentText
      );
      entityText.setAttribute("position", "2 " + counter.toString() + " 0");
      counter += 0.51;
      entityText.setAttribute(
        "geometry",
        "primitive: plane; height: 0.5; width: 1.2"
      );
      entityText.setAttribute("material", "color: red");
      entityText.setAttribute("rotation", "0 -80 0");
      entityText.setAttribute("class", "log");
      aScene.appendChild(entityText);
    });
  }
}

export function renderBuildMatrix(obj, aScene) {
  let counter = 1;
  let colCounter = 0;
  obj.jobs.map((item) => {
    if (counter > 2.6) {
      counter = 1;
      colCounter += 1;
    }
    let entityText = document.createElement("a-entity");
    let distro = item.config.dist ? item.config.dist : "No distro";
    let lang = item.config.language ? item.config.language : "No lang";
    let currentText = distro + ", " + lang;
    entityText.setAttribute(
      "text",
      "align:center;width:1.5;value:" + currentText
    );
    let posX = 0.3 + colCounter / 2;
    let posY = counter;
    let posZ = -1.2 + colCounter / 10;
    let strPos =
      posX.toString() + " " + posY.toString() + " " + posZ.toString();
    entityText.setAttribute("position", strPos);
    counter += 0.12;
    entityText.setAttribute(
      "geometry",
      "primitive: plane; height: 0.11; width: 0.5"
    );
    let color = item.state == "passed" ? "blue" : "red";
    entityText.setAttribute("material", "color: " + color);
    let rotX = -5 - colCounter * 5;
    let strRotation = "0 " + rotX + " 0";
    console.log(strRotation);
    entityText.setAttribute("rotation", strRotation);
    entityText.setAttribute("id_job", item.id);
    entityText.setAttribute("id_objeto", "buildMatrix");
    entityText.setAttribute("class", "clickable");
    entityText.setAttribute("click-component", false);
    let entityPet = document.createElement("a-gltf-model");
    let idPet = "#question";
    let scalePet = "0.001 0.001 0.001";
    if (item.config.os == "linux") {
      idPet = "#tux";
      scalePet = "0.001 0.001 0.001";
    }
    if (item.config.os == "osx") {
      idPet = "#osx";
      scalePet = "0.005 0.005 0.005";
    }
    entityPet.setAttribute("src", idPet);
    entityPet.setAttribute("scale", scalePet);
    let positionY = counter - 0.3;
    entityPet.setAttribute("position", "-0.25 -0.05 0.05");
    entityPet.setAttribute("rotation", "0 35 0");
    entityPet.setAttribute("class", "buildMatrix");
    entityText.appendChild(entityPet);
    aScene.appendChild(entityText);
  });
}
