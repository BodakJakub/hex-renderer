const terrainMap = {
    plains: "#66ff66",
    forest: "#669900",
    hills: "#ccff66",
    mountains: "#669999",
    lakes: "#3399ff",
    none: "#fff"
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

    hexes.push({cd: [x, y], terrain: "none", angle: null});
}

// hexagons and grid drawing from https://eperezcosano.github.io/hex-grid/

function drawGrid(width, height) {
    let y = r;

    for (let i = 0; y + 2 * r * Math.sin(a) < height; i++) {
        y = r + (i * 2 * r * Math.sin(a))
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += Math.round(r * ( 1 + Math.cos(a))), y += Math.round((-1) ** j++ * r * Math.sin(a))) {
            drawHexagon(x, y)
        }
    }
  }

canvas.addEventListener("click", function(e) {
    const hexIdx = findHex(e.clientX, e.clientY);

    const terrainType = getTerrainType();

    colorHex(hexIdx, terrainType);
})

canvas.addEventListener('wheel', function(e) {
    rotateRiver(e.wheelDelta > 0, e.clientX, e.clientY);
})

function rotateRiver(up, x, y) {
    const hexIdx = findHex(x, y);
    const hex = hexes[hexIdx];
    
    if (hex.terrain !== 'river') {
        return;
    }

    let angle = hex.angle || 1;

    if (up) {
        angle++;
    } else {
        angle--;
    }
    hex.angle = angle;

    renderRiver(hex)
}

function findHex(x, y) {
    const idx = hexes.findIndex(function(hex) {
        return (x < hex.cd[0] + 43.3 && x > hex.cd[0] - 43.3) &&
        (y < hex.cd[1] + 43.3 && y > hex.cd[1] - 43.3)
    })
    return idx;
}

function getTerrainType() {
    return terrainSelection.value;
}

function colorHex(index, terrainType) {
    const hexCntr = hexes[index];

    if (hexCntr.terrain === terrainType) {
        return;
    }

    if (terrainType === 'river') {
        renderRiver(hexCntr, 0);
    } else {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            ctx.lineTo(hexCntr.cd[0] + r * Math.cos(a * i), hexCntr.cd[1] + r * Math.sin(a * i));
        }
        ctx.fillStyle = terrainMap[terrainType];
        ctx.fill();
        ctx.stroke();
        hexes[index].terrain = terrainType;
    }
}

function renderRiver(hex, angle) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(hex.cd[0] + r * Math.cos(a * i), hex.cd[1] + r * Math.sin(a * i));
    }
    ctx.stroke();
    ctx.fillStyle = terrainMap['plains'];
    ctx.fill();
    ctx.strokeStyle = terrainMap['lakes'];
    ctx.closePath();
    
    ctx.beginPath();
    ctx.lineWidth = 4;
    console.log(hex.angle)

    // TODO: This has to be done in a different way than IF statement, because of scalability, but good enough for POC

    if (hex.angle === 1) {
        ctx.moveTo(hex.cd[0] + r, hex.cd[1]);
        ctx.lineTo(hex.cd[0] - r, hex.cd[1]);
    } else if (hex.angle === 2) {
        ctx.moveTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
    } else if (hex.angle === 3) {
        ctx.moveTo(hex.cd[0] + Math.cos(a) * r, hex.cd[1] + Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] - Math.cos(a) * r, hex.cd[1] - Math.sin(a) * r)
    } else if (hex.angle === 4) {
        ctx.moveTo(hex.cd[0], hex.cd[1] + Math.sin(a) * r)
        ctx.lineTo(hex.cd[0], hex.cd[1] - Math.sin(a) * r)
    } else if (hex.angle === 5) {
        ctx.moveTo(hex.cd[0] - Math.cos(a) * r, hex.cd[1] + Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] + Math.cos(a) * r, hex.cd[1] - Math.sin(a) * r)
    } else if (hex.angle === 6) {
        ctx.moveTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
    } else if (hex.angle === 7) {
        ctx.moveTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
    } else if (hex.angle === 9) {
        ctx.moveTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
    } else if (hex.angle === 10) {
        ctx.moveTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] + Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
    } else if (hex.angle === 11) {
        ctx.moveTo(hex.cd[0], hex.cd[1] + Math.sin(a) * r)
        ctx.lineTo(hex.cd[0], hex.cd[1] - Math.sin(a) * r)
    } else if (hex.angle === 12) {
        ctx.moveTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] - Math.cos(a) * Math.sin(a) * r)
        ctx.lineTo(hex.cd[0] - Math.sin(a) * Math.sin(a) * r, hex.cd[1] + Math.cos(a) * Math.sin(a) * r)
    }
    else {
        ctx.moveTo(hex.cd[0] + r, hex.cd[1]);
        ctx.lineTo(hex.cd[0] - r, hex.cd[1]);
    }
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    hex.terrain = 'river';
}

drawGrid(canvas.width, canvas.height)


// DEBUG

const btn = document.getElementById("hexes");

btn.addEventListener("click", function() {
    console.log(hexes)
})