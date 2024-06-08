/* script.js */
// fungsi inisialisasi penyelesaian SPL jacobi & seidel
function solve() {
  //fungsi utama untuk memulai proses solusi
  const { A, b } = getEquationsFromForm(); //mendapatkan matriks A dan Vektor B dari form input

  const jacobiResults = jacobiMethod(A, b, 0.0001); //menghitung solusi dengan metode jacobi
  const gaussSeidelResults = gaussSeidelMethod(A, b, 0.0001); // menghitung solusi dengan metode gauss-seidel

  displayResults("jacobi", jacobiResults); //menampilkan hasil metode jacobi
  displayResults("gauss-seidel", gaussSeidelResults); //menampilkan hasil metode gauss seidel
}

//Mengambil Matriks A dan vektor b dari form input
function getEquationsFromForm() {
  const A = [
    [
      parseFloat(document.getElementById("a11").value),
      parseFloat(document.getElementById("a12").value),
      parseFloat(document.getElementById("a13").value || 0),
    ],
    [
      parseFloat(document.getElementById("a21").value),
      parseFloat(document.getElementById("a22").value),
      parseFloat(document.getElementById("a23").value || 0),
    ],
    [
      parseFloat(document.getElementById("a31").value || 0),
      parseFloat(document.getElementById("a32").value || 0),
      parseFloat(document.getElementById("a33").value || 0),
    ],
  ];

  const b = [
    parseFloat(document.getElementById("b1").value),
    parseFloat(document.getElementById("b2").value),
    parseFloat(document.getElementById("b3").value || 0),
  ];

  return { A, b }; //mengembalikkan objek yang berisi matriks A dan vektor b
}

// Penyelesain SPL dengan metode jacobi
function jacobiMethod(A, b, tol = 1e-10) {
  const n = A.length;
  let x = Array(n).fill(0);
  let xOld = Array(n).fill(0);
  const steps = [];
  let error = tol + 1; // Inisialisasi kesalahan ke nilai yang lebih besar dari toleransi
  let iterations = 0;

  while (error > tol) {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * xOld[j];
        }
      }
      x[i] = (b[i] - sum) / A[i][i];
    }
    steps.push(`Iteration ${iterations + 1}: ${x.join(", ")}`);
    error = calculateError(x, xOld);
    xOld = [...x];
    iterations++;
  }
  return { steps, result: x }; //pengembalian nilai akhir langkah dan solusi
}

// Penyelesaian SPL dengan metode gauss seidel
function gaussSeidelMethod(A, b, tol = 1e-10) {
  const n = A.length;
  let x = Array(n).fill(0);
  const steps = [];
  let error = tol + 1; // Inisialisasi kesalahan ke nilai yang lebih besar dari toleransi
  let iterations = 0;

  while (error > tol) {
    let xOld = [...x];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      x[i] = (b[i] - sum) / A[i][i];
    }
    steps.push(`Iteration ${iterations + 1}: ${x.join(", ")}`);
    error = calculateError(x, xOld);
    iterations++;
  }
  return { steps, result: x };
}

// Menghitung error sebagai jumlah absolut dari perbedaan antara solusi baru dan lama.
function calculateError(x, xOld) {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += Math.abs(x[i] - xOld[i]);
  }
  return sum;
}

// Menampilkan langkah-langkah iterasi dan hasil akhir pada elemen HTML yang sesuai.
function displayResults(method, { steps, result }) {
  const stepsElement = document.getElementById(`${method}-steps`);
  const resultElement = document.getElementById(`${method}-result`);

  stepsElement.innerHTML = steps.map((step) => `<p>${step}</p>`).join("");
  resultElement.innerText = `Result: ${result.join(", ")}`;
}
