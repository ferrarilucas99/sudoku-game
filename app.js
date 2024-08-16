const body = document.querySelector('body');
const inputs = document.querySelectorAll('input[type="text"]');
const switchInput = document.getElementById('switch-input');
const matrix = createMatrix(9, 9);
const errorCells = new Set();
const cellErrors = new Map();

document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('dark')) {
        body.classList.add('dark');
        switchInput.checked = true;
    }
});

inputs.forEach((input) => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 1);
        updateErrors();
    });
});

switchInput.addEventListener('change', function(e) {
    if (this.checked) {
        body.classList.add('dark');
        sessionStorage.setItem('dark', 1);
    } else {
        body.classList.remove('dark');
        sessionStorage.removeItem('dark');
    }
});

function createMatrix(rows, cols) {
    let matrix = [];

    for (let i = 1; i <= rows; i++) {
        let row = [];

        for (let x = 1; x <= cols; x++) {
            let rowElement = document.querySelector(`input[data-column="${x}"][data-column-row="${i}"]`);
            row.push(rowElement);
        }
        
        matrix.push(row);
    }

    return matrix;
}

function clearErrors() {
    inputs.forEach(input => {
        if (!cellErrors.has(input)) {
            input.style.backgroundColor = '';
        }
    });
}

function highlightErrors(current) {
    const value = current.value;
    if (value === '') return;

    const row = parseInt(current.dataset.columnRow, 10) - 1;
    const column = parseInt(current.dataset.column, 10) - 1;

    clearErrors();

    for (let r = 0; r < 9; r++) {
        const cell = matrix[r][column];
        if (cell !== current && cell.value === value) {
            cell.style.backgroundColor = 'red';
            errorCells.add(cell);
        }
    }

    const rowElements = matrix[row];
    rowElements.forEach(cell => {
        if (cell !== current && cell.value === value) {
            cell.style.backgroundColor = 'red';
            errorCells.add(cell);
        }
    });

    const subgridStartRow = Math.floor(row / 3) * 3;
    const subgridStartColumn = Math.floor(column / 3) * 3;
    
    for (let r = subgridStartRow; r < subgridStartRow + 3; r++) {
        for (let c = subgridStartColumn; c < subgridStartColumn + 3; c++) {
            const cell = matrix[r][c];
            if (cell !== current && cell.value === value) {
                cell.style.backgroundColor = 'red';
                errorCells.add(cell);
            }
        }
    }

    if (value !== '') {
        current.style.backgroundColor = 'red';
        errorCells.add(current);
    }
}


function updateErrors() {
    cellErrors.clear();

    matrix.forEach((rowElements, row) => {
        rowElements.forEach((cell, column) => {
            const value = cell.value;
            if (value !== '') {
                let hasError = false;

                for (let r = 0; r < 9; r++) {
                    const otherCell = matrix[r][column];
                    if (otherCell !== cell && otherCell.value === value) {
                        cellErrors.set(otherCell, true);
                        hasError = true;
                    }
                }

                const rowCells = matrix[row];
                rowCells.forEach(otherCell => {
                    if (otherCell !== cell && otherCell.value === value) {
                        cellErrors.set(otherCell, true);
                        hasError = true;
                    }
                });

                const subgridStartRow = Math.floor(row / 3) * 3;
                const subgridStartColumn = Math.floor(column / 3) * 3;
                
                for (let r = subgridStartRow; r < subgridStartRow + 3; r++) {
                    for (let c = subgridStartColumn; c < subgridStartColumn + 3; c++) {
                        const otherCell = matrix[r][c];
                        if (otherCell !== cell && otherCell.value === value) {
                            cellErrors.set(otherCell, true);
                            hasError = true;
                        }
                    }
                }

                if (hasError) {
                    cellErrors.set(cell, true);
                }
            }
        });
    });

    clearErrors();
    cellErrors.forEach((_, cell) => {
        cell.style.backgroundColor = 'red';
    });
}