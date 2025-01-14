// Función que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    fetchNotebooksList();
});

// Función para obtener la lista de notebooks desde la API
function fetchNotebooksList() {
    fetch('https://api-flask-1-rdir.onrender.com/documentos')
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
    fetch(`https://api-flask-1-rdir.onrender.com/documentos/contenido/${notebookName}`)
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpiar contenido previo

            // Título del notebook cargado
            const titleDiv = document.createElement('div');
            titleDiv.innerHTML = `
                <h2 style="text-align: center; color: #333;">Resultados de: ${notebookName}</h2>
            `;
            contentDiv.appendChild(titleDiv);

            // Procesar las celdas
            data.forEach(cell => {
                if (cell.tipo === 'código') {
                    // Mostrar las salidas relevantes, específicamente para el notebook "Árboles de decisión"
                    cell.salidas.forEach(salida => {
                        if (salida.tipo === 'texto') {
                            // Mostrar resultados de accuracy
                            const accuracyDiv = document.createElement('div');
                            if (salida.contenido.toLowerCase().includes("accuracy")) {
                                accuracyDiv.innerHTML = `
                                    <div style="background-color: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 5px;">
                                        <h3 style="color: #4CAF50;">Exactitud (Accuracy)</h3>
                                        <p>${salida.contenido}</p>
                                    </div>
                                `;
                                contentDiv.appendChild(accuracyDiv);
                            }
                        } else if (salida.tipo === 'imagen') {
                            // Mostrar gráficos generados
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
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}
