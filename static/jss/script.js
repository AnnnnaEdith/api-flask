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
                notebooksList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener la lista de notebooks:', error);
        });
}

// Función para obtener el contenido de un notebook
function fetchNotebookContent(notebookName) {
    fetch('https://api-flask-gmko.onrender.com/documentos/contenido/${notebookName}')
        .then(response => response.json())
        .then(data => {
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpiar contenido previo

            // Mostrar únicamente los resultados y las celdas de Markdown
            data.forEach(cell => {
                if (cell.tipo === 'texto') {
                    // Celda de Markdown
                    const markdownDiv = document.createElement('div');
                    markdownDiv.innerHTML = `<div><strong>Markdown:</strong></div><pre>${cell.contenido}</pre>`;
                    contentDiv.appendChild(markdownDiv);
                } else if (cell.tipo === 'código') {
                    // Mostrar únicamente las salidas de las celdas de código
                    cell.salidas.forEach(salida => {
                        const salidaDiv = document.createElement('div');

                        if (salida.tipo === 'texto') {
                            salidaDiv.innerHTML = `<div><strong>Salida (Texto):</strong></div><pre>${salida.contenido}</pre>`;
                        } else if (salida.tipo === 'imagen') {
                            salidaDiv.innerHTML = `<div><strong>Salida (Imagen):</strong></div><img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida"/>`;
                        } else if (salida.tipo === 'json') {
                            salidaDiv.innerHTML = `<div><strong>Salida (JSON):</strong></div><pre>${JSON.stringify(salida.contenido, null, 2)}</pre>`;
                        } else if (salida.tipo === 'html') {
                            salidaDiv.innerHTML = `<div><strong>Salida (HTML):</strong></div><div>${salida.contenido}</div>`;
                        }

                        contentDiv.appendChild(salidaDiv);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}
