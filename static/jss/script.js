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

            // Mostrar solo las salidas y celdas de texto
            data.forEach(cell => {
                if (cell.tipo === 'texto') {
                    const textCellDiv = document.createElement('div');
                    textCellDiv.innerHTML = `
                        <pre>${cell.contenido}</pre>
                    `;
                    contentDiv.appendChild(textCellDiv);
                } else if (cell.tipo === 'código') {
                    cell.salidas.forEach(salida => {
                        const outputDiv = document.createElement('div');
                        if (salida.tipo === 'texto') {
                            outputDiv.innerHTML = `
                                <pre>${salida.contenido}</pre>
                            `;
                        } else if (salida.tipo === 'imagen') {
                            outputDiv.innerHTML = `
                                <img src="data:image/png;base64,${salida.contenido}" alt="Imagen de salida"/>
                            `;
                        } else if (salida.tipo === 'json') {
                            outputDiv.innerHTML = `
                                <pre>${JSON.stringify(salida.contenido, null, 2)}</pre>
                            `;
                        } else if (salida.tipo === 'html') {
                            outputDiv.innerHTML = `
                                <div>${salida.contenido}</div>
                            `;
                        }
                        contentDiv.appendChild(outputDiv);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener el contenido del notebook:', error);
        });
}
