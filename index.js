const terrainMap = {
    plains: "#66ff66",
    forest: "#669900",
    hills: "#ccff66",
    mountains: "#669999",
    lakes: "#3399ff",
    reset: "#fff"
}

const a = 2 * Math.PI / 6;
const r = 50;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const terrainSelection = document.getElementById("terrain");

const hexes = [];

function drawHexagon(x, y) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.stroke();

    hexes.push([x, y]);
}

// hexagons and grid drawing from https://eperezcosano.github.io/hex-grid/

function drawGrid(width, height) {
    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
      for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
        drawHexagon(x, y);
      }
    }
  }

canvas.addEventListener("click", function(e) {
    const hexIdx = findHex(e.clientX, e.clientY);

    const terrainType = getTerrainType();

    colorHex(hexIdx, terrainType);
})

function findHex(x, y) {
    const idx = hexes.findIndex(function(hex) {
        return (x < hex[0] + 43.3 && x > hex[0] - 43.3) &&
        (y < hex[1] + 43.3 && y > hex[1] - 43.3)
    })

    return idx;
}

function getTerrainType() {
    return terrainSelection.value;
}

function colorHex(index, terrainType) {
    const hexCntr = hexes[index];
    
    ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(hexCntr[0] + r * Math.cos(a * i), hexCntr[1] + r * Math.sin(a * i));
        }
        ctx.fillStyle = terrainMap[terrainType];
        ctx.fill();
        ctx.stroke();
}

drawGrid(canvas.width, canvas.height)


