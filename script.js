// Game configuration
const symbols = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍑', '🥝', '🍉'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    
    // Create pairs of cards
    const gameCards = [...symbols, ...symbols];
    
    // Shuffle cards
    shuffleArray(gameCards);
    
    // Create card elements
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    gameCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
    
    updateDisplay();
    showMessage('Click cards to find matching pairs!');
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Flip card
function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped')) return;
    if (this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        updateDisplay();
        checkMatch();
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        // Match found
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        
        flippedCards = [];
        lockBoard = false;
        
        updateDisplay();
        
        if (matchedPairs === symbols.length) {
            setTimeout(() => {
                showMessage(`Congratulations! You won in ${moves} moves!`, true);
            }, 500);
        } else {
            showMessage('Great match! Keep going!');
        }
    } else {
        // No match
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            flippedCards = [];
            lockBoard = false;
            showMessage('Try again!');
        }, 1000);
    }
}

// Update display
function updateDisplay() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
}

// Show message
function showMessage(text, isSuccess = false) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message' + (isSuccess ? ' success' : '');
    
    if (isSuccess) {
        setTimeout(() => {
            messageEl.className = 'message';
        }, 3000);
    }
}

// Reset button
document.getElementById('reset-btn').addEventListener('click', initGame);

// Start game when page loads
initGame();

