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

            // Mostrar solo las salidas de las celdas
            data.forEach(cell => {
                if (cell.tipo === 'código') {
                    cell.salidas.forEach(salida => {
                        const salidaDiv = document.createElement('div');
                        if (salida.tipo === 'texto') {
                            salidaDiv.innerHTML = `
                                <pre>${salida.contenido}</pre>
                            `;
                        } else if (salida.tipo === 'imagen') {
                            salidaDiv.innerHTML = `
                                <img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida"/>
                            `;
                        } else if (salida.tipo === 'json') {
                            salidaDiv.innerHTML = `
                                <pre>${JSON.stringify(salida.contenido, null, 2)}</pre>
                            `;
                        } else if (salida.tipo === 'html') {
                            salidaDiv.innerHTML = `
                                <div>${salida.contenido}</div>
                            `;
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
