let matrixInputs = [];
let pInputs = [];

function createMatrix() {
    const rows = document.getElementById("rows").value;
    const columns = document.getElementById("columns").value;
    const matrixTable = document.getElementById("matrix");
    const pValuesContainer = document.getElementById("pValuesContainer");
    const fileInput = document.getElementById("fileInput");

    // Clear existing table, matrixInputs array, and pInputs array
    matrixTable.innerHTML = "";
    pValuesContainer.innerHTML = "";
    matrixInputs = [];
    pInputs = [];

    // Check if a file is selected
    
        // Create input fields for p above each column
        for (let j = 0; j < columns; j++) {
            const pInput = document.createElement("input");
            pInput.type = "number";
            pInput.min = "0";
            pInput.max = "1";
            pInput.step = "0.01";
            pInput.placeholder = `p${j + 1}`;
            pInputs.push(pInput);
            pValuesContainer.appendChild(pInput);
        }
        // Create the matrix
        for (let i = 0; i < rows; i++) {
            const row = matrixTable.insertRow(i);
            matrixInputs[i] = [];
            for (let j = 0; j < columns; j++) {
                const cell = row.insertCell(j);
                const input = document.createElement("input");
                input.type = Number;
                input.value = 0;
                input.addEventListener("focus", function () {
                    this.select();
                });
                matrixInputs[i][j] = input;
                cell.appendChild(input);
            }
        }
    

  // Show the shiiiits
  document.getElementById("p-input-wrapper").style.display = "block";
  document.getElementById("aInput").style.display = "block";
  document.getElementById("calculateButton").style.display = "block";
}

function importPs() {
    const pInput = document.getElementById("pInput");

    if (pInput.files.length > 0) {
        const selectedFile = pInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result.split(/\s+/);
            const pValues = fileContent.filter(val => val.trim() !== '').map(val => parseFloat(val));

            if (pValues.some(isNaN) || pValues.some(val => val < 0 || val > 1)) {
                alert("Invalid values for p. Please enter values between 0 and 1 in the file.");
                return;
            }

            // Clear existing p inputs
            pValuesContainer.innerHTML = "";
            pInputs = [];

            // Populate the p inputs
            pValues.forEach((value, index) => {
                const pInput = document.createElement("input");
                pInput.type = Number;
                pInput.min = "0";
                pInput.max = "1";
                pInput.step = "0.01";
                pInput.value = value;
                pInputs.push(pInput);
                pValuesContainer.appendChild(pInput);
            });

            // Show the p values container
            document.getElementById("pValuesContainer").style.display = "block";
        };

        reader.readAsText(selectedFile);
    }
}


// Function to handle file input and create matrix
function handleFileSelect() {
    const rowsInput = document.getElementById("rows");
    const columnsInput = document.getElementById("columns");
    const fileInput = document.getElementById("fileInput");

    // Clear existing table, matrixInputs array, and pInputs array
    const matrixTable = document.getElementById("matrix");
    const pValuesContainer = document.getElementById("pValuesContainer");
    
    matrixTable.innerHTML = "";
    pValuesContainer.innerHTML = "";
    matrixInputs = [];
    pInputs = [];

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileContent = event.target.result.split('\n');

            // Determine dimensions based on file content
            const fileRows = fileContent.length;
            const fileColumns = fileContent[0] ? fileContent[0].split(' ').length : 0;

            // Update rows and columns input values
            rowsInput.value = fileRows;
            columnsInput.value = fileColumns;

            // Create the matrix
            createMatrix(fileRows, fileColumns);

            // Populate the matrix with file content
            for (let i = 0; i < fileRows; i++) {
                const values = fileContent[i].split(' ');
                for (let j = 0; j < fileColumns; j++) {
                    matrixInputs[i][j].value = values[j] || "";
                }
            }
        };

        reader.readAsText(selectedFile);
    }
}


function calculateCriteria() {
  const matrix = matrixInputs.map(row => row.map(input => parseFloat(input.value)));
  const pValues = pInputs.map(input => parseFloat(input.value));
  const aValue = parseFloat(document.getElementById("aValue").value);

  // Validate input values for p
  if (pValues.some(isNaN) || pValues.some(val => val < 0 || val > 1)) {
      alert("Введіть значення p між 0 та 1.");
      return;
  }

  runBayesianCriterion(matrix, pValues);
  minimizationOfDispersionCriterion(matrix, pValues);
  maximizationOfProbabilityDistributionOfGradesCriterion(matrix, pValues, aValue);
  modalCriterion(matrix, pValues);
}

function runBayesianCriterion(matrix, p) {
  let z = [];

  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      let zi = 0;
      for (let j = 0; j < matrix[0].length; j++) {
          zi += matrix[i][j] * p[j];
      }
      z.push(zi);
  }

  // Finding alternatives with maximum value
  const max_value = Math.max(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === max_value) {
          optimalAlternatives.push(i + 1);
      }
  }

  // Display result on the page
  const resultDiv = document.getElementById("bayesianResult");
  resultDiv.innerHTML = "<h3>Критерій Байєса:</h3>";
  if (optimalAlternatives.length > 0) {
      resultDiv.innerHTML += "<p>Оптимальні альтернативи:</p>";
      resultDiv.innerHTML += `<p>${optimalAlternatives.join(", ")}</p>`;

  } else {
      resultDiv.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
  }
}

function minimizationOfDispersionCriterion(matrix, p) {
  let z = [];

  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      let zi = 0;
      let tempSum = 0;
      for (let j = 0; j < matrix[0].length; j++) {
          tempSum += matrix[i][j] * p[j];
          zi += matrix[i][j] ** 2 * p[j];
      }
      zi -= tempSum ** 2;
      z.push(Math.sqrt(zi));
  }

  // Finding alternatives with minimum value
  const minValue = Math.min(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === minValue) {
          optimalAlternatives.push(i + 1);
      }
  }

  // Display result on the page
  const resultDiv = document.getElementById("dispersionResult");
  resultDiv.innerHTML = "<h3>Мінімізація за критерієм дисперсії:</h3>";
  if (optimalAlternatives.length > 0) {
      resultDiv.innerHTML += "<p>Оптимальні альтернативи:</p>";
      resultDiv.innerHTML += `<p>${optimalAlternatives.join(", ")}</p>`;
  } else {
      resultDiv.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
  }
}


function maximizationOfProbabilityDistributionOfGradesCriterion(matrix, p, a) {
  let z = [];

  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      let zi = 0;
      for (let j = 0; j < matrix[0].length; j++) {
          if (matrix[i][j] >= a) {
              zi += p[j];
          }
      }
      z.push(zi);
  }

  // Finding alternatives with maximum value
  const max_value = Math.max(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === max_value) {
          optimalAlternatives.push(i + 1);
      }
  }

  // Display result on the page
  const resultDiv = document.getElementById("maximizationResult");
  resultDiv.innerHTML = `<h3>Максимізація ймовірності розподілу оцінок при a = ${a}:</h3>`;
  if (optimalAlternatives.length > 0) {
      resultDiv.innerHTML += "<p>Оптимальні альтернативи:</p>";
      resultDiv.innerHTML += `<p>${optimalAlternatives.join(", ")}</p>`;
  } else {
      resultDiv.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
  }
}

function modalCriterion(matrix, p) {
  let z = [];
  const p0 = Math.max(...p);
  let maxPCount = 0;

  for (const pi of p) {
      if (pi === p0) {
          maxPCount++;
      }
      if (maxPCount > 1) {
          // Display result on the page
          const resultDiv = document.getElementById("modalResult");
          resultDiv.innerHTML = "<h3>Модальний критерій:</h3>";
          resultDiv.innerHTML += "<p>Найоптимальніший варіант за модальним критерієм не може бути визначений, так як кількість максимальних ймовірностей більша за 1.</p>";
          return;
      }
  }

  const p0Index = p.indexOf(p0);
  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      z.push(matrix[i][p0Index]);
  }

  // Finding alternatives with maximum value
  const max_value = Math.max(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === max_value) {
          optimalAlternatives.push(i + 1);
      }
  }

  // Display result on the page
  const resultDiv = document.getElementById("modalResult");
  resultDiv.innerHTML = "<h3>Модальний критерій:</h3>";
  if (optimalAlternatives.length > 0) {
      resultDiv.innerHTML += "<p>Оптимальні альтернативи:</p>";
      resultDiv.innerHTML += `<p>${optimalAlternatives.join(", ")}</p>`;
  } else {
      resultDiv.innerHTML += "<p>Оптимальних альтернатив не знайдено.</p>";
  }
}