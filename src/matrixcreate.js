let matrixInputs = [];
let pInputs = [];

function createMatrix() {
  const rows = document.getElementById("rows").value;
  const columns = document.getElementById("columns").value;
  const matrixTable = document.getElementById("matrix");
  const pValuesContainer = document.getElementById("pValuesContainer");
  const criteriaButtons = document.getElementById("criteriaButtons");

  // Clear existing table, matrixInputs array, and pInputs array
  matrixTable.innerHTML = "";
  pValuesContainer.innerHTML = "";
  criteriaButtons.classList.add("hidden");
  matrixInputs = [];
  pInputs = [];

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

  criteriaButtons.classList.remove("hidden");
}

function logMatrix() {
  for (let i = 0; i < matrixInputs.length; i++) {
    for (let j = 0; j < matrixInputs[i].length; j++) {
      console.log(`Matrix[${i + 1}][${j + 1}]:`, matrixInputs[i][j].value);
    }
  }
}

function minimizationOfDispersionCriterion() {
  const matrix = matrixInputs.map(row => row.map(input => parseFloat(input.value)));
  const pValues = pInputs.map(input => parseFloat(input.value));

  let z = [];

  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      let zi = 0;
      let tempSum = 0;
      for (let j = 0; j < matrix[0].length; j++) {
          tempSum += matrix[i][j] * pValues[j];
          zi += matrix[i][j] ** 2 * pValues[j];
      }
      zi -= tempSum ** 2;
      z.push(Math.sqrt(zi));
  }

  // Finding alternatives with minimum value
  const minValue = Math.min(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === minValue) {
          optimalAlternatives.push(i);
      }
  }

  console.log("\nOptimal alternatives according to Minimization of Dispersion Criterion:");
  for (const index of optimalAlternatives) {
      console.log(`Alternative ${index + 1}`);
  }
  console.log();
}

function maximizationOfProbabilityDistributionOfGradesCriterion() {
  const matrix = matrixInputs.map(row => row.map(input => parseFloat(input.value)));
  const pValues = pInputs.map(input => parseFloat(input.value));
  const aValue = parseFloat(document.getElementById("aValue").value);

  // Validate input value for a
  if (isNaN(aValue) || aValue < 0 || aValue > 1) {
      alert("Please enter a valid value for a between 0 and 1.");
      return;
  }

  let z = [];

  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      let zi = 0;
      for (let j = 0; j < matrix[0].length; j++) {
          if (matrix[i][j] >= aValue) {
              zi += pValues[j];
          }
      }
      z.push(zi);
  }

  // Finding alternatives with maximum value
  const max_value = Math.max(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === max_value) {
          optimalAlternatives.push(i);
      }
  }

  console.log(`\nOptimal alternatives according to Maximization of Probability Distribution of Grades Criterion (a = ${aValue}):`);
  for (const index of optimalAlternatives) {
      console.log(`Alternative ${index + 1}`);
  }
  console.log();
}

function modalCriterion() {
  const matrix = matrixInputs.map(row => row.map(input => parseFloat(input.value)));
  const pValues = pInputs.map(input => parseFloat(input.value));

  let z = [];
  const p0 = Math.max(...pValues);
  let maxPCount = 0;

  for (const pi of pValues) {
      if (pi === p0) {
          maxPCount++;
      }
      if (maxPCount > 1) {
          console.log("\nOptimal alternative according to Modal Criterion cannot be determined,",
              "as the number of maximum probabilities is greater than 1\n");
          return;
      }
  }

  const p0Index = pValues.indexOf(p0);
  // Finding zi values in each row
  for (let i = 0; i < matrix.length; i++) {
      z.push(matrix[i][p0Index]);
  }

  // Finding alternatives with maximum value
  const max_value = Math.max(...z);
  const optimalAlternatives = [];

  for (let i = 0; i < z.length; i++) {
      if (z[i] === max_value) {
          optimalAlternatives.push(i);
      }
  }

  console.log("\nOptimal alternatives according to Modal Criterion:");
  for (const index of optimalAlternatives) {
      console.log(`Alternative ${index + 1}`);
  }
  console.log();
}