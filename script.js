// script.js

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const cells = Array.from(document.querySelectorAll('.cell'));
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');

let board = Array(9).fill('');
let currentPlayer = 'X';
let running = true;

function updateStatus(text){
  statusEl.textContent = text ?? `Player ${currentPlayer}'s turn`;
}

function startGame(){
  board.fill('');
  currentPlayer = 'X';
  running = true;
  cells.forEach(c => {
    c.disabled = false;
    c.textContent = '';
    c.classList.remove('x','o','win');
  });
  updateStatus();
}

function handleCellClick(e){
  const btn = e.currentTarget;
  const idx = Number(btn.dataset.index);
  if(!running || board[idx]) return;

  placeMark(btn, idx, currentPlayer);

  const winCombo = checkWin(currentPlayer);
  if(winCombo){
    running = false;
    highlightWin(winCombo);
    updateStatus(`Player ${currentPlayer} wins!`);
    disableBoard();
    return;
  }

  if(isDraw()){
    running = false;
    updateStatus("It's a draw!");
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
}

function placeMark(btn, idx, player){
  board[idx] = player;
  btn.textContent = player;
  btn.classList.add(player.toLowerCase()); // adds 'x' or 'o'
  btn.disabled = true;
}

function checkWin(player){
  for(const combo of WIN_COMBOS){
    const [a,b,c] = combo;
    if(board[a] === player && board[b] === player && board[c] === player){
      return combo;
    }
  }
  return null;
}

function highlightWin(combo){
  combo.forEach(i => cells[i].classList.add('win'));
}

function isDraw(){
  return board.every(cell => cell !== '');
}

function disableBoard(){
  cells.forEach(c => c.disabled = true);
}

function resetBoard(){
  // same as startGame but keeps any future scoreboard if added
  startGame();
}

/* keyboard support: Enter/Space activates cell when focused */
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
  cell.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});

restartBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetBoard);

/* initial start */
startGame();
