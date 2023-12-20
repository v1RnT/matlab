let matrixInputs2 = [];

function createMatrix2() {
    const rows2 = document.getElementById("rows2").value;
    const columns2 = document.getElementById("columns2").value;
    const matrixTable2 = document.getElementById("matrix2");

    // Clear existing table and matrixInputs array
    matrixTable2.innerHTML = "";
    matrixInputs2 = [];

    // Create the matrix
    for (let i = 0; i < rows2; i++) {
        const row = matrixTable2.insertRow(i);
        matrixInputs2[i] = [];
        for (let j = 0; j < columns2; j++) {
            const cell = row.insertCell(j);
            const input = document.createElement("input");
            input.type = Number;
            input.value = 0;
            input.addEventListener("focus", function () {
                this.select();
            });
            matrixInputs2[i][j] = input;
            cell.appendChild(input);
        }
    }
    // Show the calculate button
    document.getElementById("evaluateCriteria2").style.display = "block";
}

function evaluateCriteria2() {
    let matrix2 = matrixInputs2.map(row => row.map(input => parseInt(input.value)));
    let alpha2 = parseFloat(document.getElementById("alpha2").value);

    // Evaluate decision-making criteria functions
    let maxmaxResult2 = maxmaxCriterion2(matrix2);
    let minimaxResult2 = minimaxCriterion2(matrix2);
    let gurvichResult2 = gurvichCriterion2(matrix2, alpha2);
    let sevidzchResult2 = sevidzchCriterion2(matrix2);

    // Display results on the page
    displayResults2(maxmaxResult2, minimaxResult2, gurvichResult2, sevidzchResult2);
}

function maxmaxCriterion2(matrix2) {
    let maxValues2 = [];

    // Finding maximum values in each row
    for (let row of matrix2) {
        maxValues2.push(Math.max(...row));
    }

    let maxmaxValue2 = Math.max(...maxValues2);
    let optimalAlternatives2 = [];

    // Finding alternatives with maximum value
    for (let i = 0; i < maxValues2.length; i++) {
        if (maxValues2[i] === maxmaxValue2) {
            optimalAlternatives2.push(i + 1);
        }
    }

    return { criterion2: "Максмакс Критерій", optimalAlternatives2: optimalAlternatives2 };
}

function minimaxCriterion2(matrix2) {
    let minimaxValues2 = matrix2.map(row => Math.min(...row));
    let optimalValue2 = Math.max(...minimaxValues2);
    let optimalAlternatives2 = [];

    // Finding alternatives with optimal value
    for (let i = 0; i < minimaxValues2.length; i++) {
        if (minimaxValues2[i] === optimalValue2) {
            optimalAlternatives2.push(i + 1);
        }
    }

    return { criterion2: "Мінмакс Критерій", optimalAlternatives2: optimalAlternatives2 };
}

function gurvichCriterion2(matrix2, alpha2) {
    let gurvichValues2 = [];

    // Calculating values using Gurvich formula
    for (let row of matrix2) {
        gurvichValues2.push(alpha2 * Math.max(...row) + (1 - alpha2) * Math.min(...row));
    }

    let optimalValue2 = Math.max(...gurvichValues2);
    let optimalAlternatives2 = [];

    // Finding alternatives with optimal value
    for (let i = 0; i < gurvichValues2.length; i++) {
        if (gurvichValues2[i] === optimalValue2) {
            optimalAlternatives2.push(i + 1);
        }
    }

    return { criterion2: `Критерій Гурвіча з альфа=${alpha2}`, optimalAlternatives2: optimalAlternatives2 };
}

function sevidzchCriterion2(matrix2) {
    let sevidzchValues2 = [];

    // Finding maximum values for each state of the environment
    for (let i = 0; i < matrix2[0].length; i++) {
        let curMax2 = Number.NEGATIVE_INFINITY;
        for (let j = 0; j < matrix2.length; j++) {
            curMax2 = Math.max(curMax2, matrix2[j][i]);
        }
        sevidzchValues2.push(curMax2);
    }

    // Updating matrix of unrealized profits
    for (let i = 0; i < matrix2.length; i++) {
        for (let j = 0; j < matrix2[0].length; j++) {
            matrix2[i][j] = sevidzchValues2[j] - matrix2[i][j];
        }
    }

    let minValues2 = [];

    // Finding maximum values in the rows of the new matrix
    for (let row of matrix2) {
        minValues2.push(Math.max(...row));
    }

    let optimalValue2 = Math.min(...minValues2);
    let optimalAlternatives2 = [];

    // Finding alternatives with optimal value
    for (let i = 0; i < minValues2.length; i++) {
        if (minValues2[i] === optimalValue2) {
            optimalAlternatives2.push(i + 1);
        }
    }

    return { criterion2: "Критерій Севіджа", optimalAlternatives2: optimalAlternatives2 };
}

function displayResults2(maxmaxResult2, minimaxResult2, gurvichResult2, sevidzchResult2) {
    let resultsDiv2 = document.getElementById("results2");
    resultsDiv2.innerHTML = "";

    // Display Maxmax Criterion results
    resultsDiv2.innerHTML += `<h3>${maxmaxResult2.criterion2}</h3>`;
    if (maxmaxResult2.optimalAlternatives2.length > 0) {
        resultsDiv2.innerHTML += "<p>Оптимальні альтернативи:</p>";
        resultsDiv2.innerHTML += `<p>${maxmaxResult2.optimalAlternatives2.join(", ")}</p>`;
    } else {
        resultsDiv2.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
    }

    // Display Minimax Criterion results
    resultsDiv2.innerHTML += `<h3>${minimaxResult2.criterion2}</h3>`;
    if (minimaxResult2.optimalAlternatives2.length > 0) {
        resultsDiv2.innerHTML += "<p>Оптимальні альтернативи:</p>";
        resultsDiv2.innerHTML += `<p>${minimaxResult2.optimalAlternatives2.join(", ")}</p>`;
    } else {
        resultsDiv2.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
    }

    // Display Gurvich Criterion results
    resultsDiv2.innerHTML += `<h3>${gurvichResult2.criterion2}</h3>`;
    if (gurvichResult2.optimalAlternatives2.length > 0) {
        resultsDiv2.innerHTML += "<p>Оптимальні альтернативи:</p>";
        resultsDiv2.innerHTML += `<p>${gurvichResult2.optimalAlternatives2.join(", ")}</p>`;
    } else {
        resultsDiv2.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
    }

    // Display Sevidzch Criterion results
    resultsDiv2.innerHTML += `<h3>${sevidzchResult2.criterion2}</h3>`;
    if (sevidzchResult2.optimalAlternatives2.length > 0) {
        resultsDiv2.innerHTML += "<p>Оптимальні альтернативи:</p>";
        resultsDiv2.innerHTML += `<p>${sevidzchResult2.optimalAlternatives2.join(", ")}</p>`;
    } else {
        resultsDiv2.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
    }
}