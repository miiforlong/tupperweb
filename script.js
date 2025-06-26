    const canvas = document.getElementById('tupperCanvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('nInput');
    const artistMode = document.getElementById('artistMode');

    const cols = 106;
    const rows = 17;
    let pixelSize = 5;
    let grid = new Array(cols * rows).fill(0);

    function computePixelSize() {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - 100;
      return Math.floor(Math.min(maxWidth / cols, maxHeight / rows));
    }

    function updateCanvasSize() {
      pixelSize = computePixelSize();
      canvas.width = cols * pixelSize;
      canvas.height = rows * pixelSize;
    }

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          ctx.fillStyle = grid[index] === 1 ? '#000' : '#fff';
          ctx.fillRect(x * pixelSize, (rows - 1 - y) * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    function bigintFromGrid() {
      const bits = grid.slice().reverse().join('');
      return BigInt('0b' + bits).toString();
    }

    function gridFromBigint(nStr) {
      try {
        let bin = BigInt(nStr).toString(2).padStart(cols * rows, '0');
        bin = bin.split('').reverse();
        grid = bin.map(b => b === '1' ? 1 : 0);
      } catch (e) {
        grid = new Array(cols * rows).fill(0);
      }
    }

    function drawFromInput() {
      gridFromBigint(input.value);
      drawGrid();
    }

    input.addEventListener('input', drawFromInput);
    window.addEventListener('resize', () => {
      updateCanvasSize();
      drawGrid();
    });

    canvas.addEventListener('click', (e) => {
      if (!artistMode.checked) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / pixelSize);
      const y = rows - 1 - Math.floor((e.clientY - rect.top) / pixelSize);
      const index = y * cols + x;
      if (index >= 0 && index < grid.length) {
        grid[index] = grid[index] ? 0 : 1;
        input.value = bigintFromGrid();
        drawGrid();
      }
    });

const N_par_defaut = "96504300048182480509519391776094028205736903607972462120875016445030118549742802310153872770853857227460881907067845965468452309489788208284791234065660863334758778982298644954541923756972472571533517273634810228089413303470323135514331316224";

let utilise_valeur_par_defaut = true;

function draw() {
  const n = input.value.trim();
  if (n === "" && utilise_valeur_par_defaut) {
    gridFromBigint(N_par_defaut);
  } else if (/^\d+$/.test(n)) {
    gridFromBigint(n);
  }
  drawGrid();
}

input.addEventListener('input', () => {
  if (utilise_valeur_par_defaut) {
    utilise_valeur_par_defaut = false;
  }
  draw();
});

window.addEventListener('resize', () => {
  updateCanvasSize();
  draw();
});

// Initialisation
updateCanvasSize();
draw();
