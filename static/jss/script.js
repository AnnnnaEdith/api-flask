// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    fetchNotebooksList();
});

// Función para obtener la lista de notebooks desde la API
function fetchNotebooksList() {
    fetch('https://api-flask-gmko.onrender.com/documentos')
        .then(response => response.json())
        .then(data => {
            const notebooksList = document.getElementById('notebooks-list');
            notebooksList.innerHTML = ''; // Limpiar la lista antes de agregar los items

            if (data.length === 0) {
                notebooksList.innerHTML = '<li>No se encontraron archivos .ipynb</li>';
                return;
            }

            // Agregar cada archivo a la lista
            data.forEach(notebook => {
                const li = document.createElement('li');
                li.textContent = notebook;
                li.onclick = () => fetchNotebookContent(notebook);
                li.style.cursor = 'pointer';
                li.style.margin = '10px 0';
                li.style.fontSize = '16px';
                li.style.color = '#007BFF';
                li.style.textDecoration = 'underline';
                notebooksList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de notebooks:', error);
        });
}

// Función para obtener el contenido de un notebook
function fetchNotebookContent(notebookName) {
    fetch(`https://api-flask-gmko.onrender.com/documentos/contenido/${notebookName}`)
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpiar contenido previo

            // Verificamos que la respuesta contiene celdas
            if (!Array.isArray(data)) {
                contentDiv.innerHTML = '<p>No se encontraron datos o el formato es incorrecto.</p>';
                return;
            }

            // Título del notebook cargado
            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = `
                <h2 style="text-align: center; color: #333;">Resultados de: ${notebookName}</h2>
            `;
            contentDiv.appendChild(titleDiv);

            let foundF1Score = false;
            let foundAccuracy = false;

            // Procesamos cada celda
            data.forEach(cell => {
                // Verificamos la existencia de tipo 'código'
                if (cell.tipo === 'código') {
                    // Si hay salidas, procesamos cada tipo de salida
                    cell.salidas.forEach(salida => {
                        if (salida.tipo === 'texto') {
                            // Buscamos si el texto contiene "f1_score"
                            if (salida.contenido.toLowerCase().includes("f1_score")) {
                                const f1scoreDiv = document.createElement('div');
                                f1scoreDiv.innerHTML = `
                                    <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
                                        <h3 style="color: #4CAF50;">Resultado F1-Score</h3>
                                        <p>${salida.contenido}</p>
                                    </div>
                                `;
                                contentDiv.appendChild(f1scoreDiv);
                                foundF1Score = true;
                            }
                            // Buscamos si el texto contiene "accuracy"
                            if (salida.contenido.toLowerCase().includes("accuracy")) {
                                const accuracyDiv = document.createElement('div');
                                accuracyDiv.innerHTML = `
                                    <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
                                        <h3 style="color: #2196F3;">Resultado Accuracy</h3>
                                        <p>${salida.contenido}</p>
                                    </div>
                                `;
                                contentDiv.appendChild(accuracyDiv);
                                foundAccuracy = true;
                            }
                        } else if (salida.tipo === 'imagen') {
                            // Si la salida es una imagen (gráfico), la mostramos
                            const imageDiv = document.createElement('div');
                            imageDiv.innerHTML = `
                                <div style="text-align: center; margin: 10px 0;">
                                    <h3 style="color: #2196F3;">Gráfico Generado</h3>
                                    <img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida" style="max-width: 100%; border: 1px solid #ddd; border-radius: 5px; padding: 5px;"/>
                                </div>
                            `;
                            contentDiv.appendChild(imageDiv);
                        }
                    });
                }
            });

            // Si no se encuentra información de F1-score, informamos al usuario
            if (!foundF1Score) {
                const noF1ScoreDiv = document.createElement('div');
                noF1ScoreDiv.innerHTML = `
                    <div style="background-color: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                        <h3 style="color: #856404;">No se encontró información de F1-Score.</h3>
                    </div>
                `;
                contentDiv.appendChild(noF1ScoreDiv);
            }

            // Si no se encuentra información de Accuracy, informamos al usuario
            if (!foundAccuracy) {
                const noAccuracyDiv = document.createElement('div');
                noAccuracyDiv.innerHTML = `
                    <div style="background-color: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                        <h3 style="color: #856404;">No se encontró información de Accuracy.</h3>
                    </div>
                `;
                contentDiv.appendChild(noAccuracyDiv);
            }

        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}


