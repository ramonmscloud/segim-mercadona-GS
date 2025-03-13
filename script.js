document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const listContainer = document.getElementById('listContainer');
    const verTodosButton = document.getElementById('verTodos');
    const verMiListaButton = document.getElementById('verMiLista');
    const generarTXTButton = document.getElementById('generarTXT');
    const borrarListaButton = document.getElementById('borrarLista');

    let shoppingList = []; // Array para guardar la lista de compras

    // Cargar archivo
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                processFileContent(content);
            };
            reader.readAsText(file);
        }
    });

    // Procesar el contenido del archivo
    function processFileContent(content) {
        shoppingList = []; // Reiniciar la lista
        const lines = content.split('\n');

        let currentAisle = null;
        lines.forEach(line => {
            line = line.trim(); // Eliminar espacios en blanco

            if (line.match(/^\d+ -/)) { // Detectar pasillo
                currentAisle = { type: 'aisle', text: line };
                shoppingList.push(currentAisle);
            } else if (line) { // Detectar elementos
                shoppingList.push({
                    type: 'item',
                    text: line,
                    checked: false
                });
            }
        });

        renderList(shoppingList);
    }

    // Renderizar la lista en el HTML
    function renderList(list) {
        listContainer.innerHTML = ''; // Limpiar el contenedor

        list.forEach((item, index) => {
            if (item.type === 'aisle') {
                const aisleHeader = document.createElement('div');
                aisleHeader.classList.add('aisle-header');
                aisleHeader.textContent = item.text;
                listContainer.appendChild(aisleHeader);
            } else if (item.type === 'item') {
                const listItem = document.createElement('div');
                listItem.classList.add('list-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.checked;
                checkbox.addEventListener('change', () => {
                    item.checked = checkbox.checked;
                    listItem.classList.toggle('checked', item.checked);
                });
                listItem.appendChild(checkbox);

                const itemText = document.createTextNode(item.text);
                listItem.appendChild(itemText);

                if (item.checked) {
                    listItem.classList.add('checked');
                }

                listContainer.appendChild(listItem);
            }
        });
    }

    // Botón Ver Todos
    verTodosButton.addEventListener('click', () => {
        renderList(shoppingList);
    });

    // Botón Ver Mi Lista
    verMiListaButton.addEventListener('click', () => {
        const miLista = shoppingList.filter(item => item.type === 'aisle' || (item.type === 'item' && item.checked));
        renderList(miLista);
    });

    // Botón Generar TXT
    generarTXTButton.addEventListener('click', () => {
        const checkedItems = shoppingList.filter(item => item.type === 'item' && item.checked);
        const text = checkedItems.map(item => item.text).join('\n');
        downloadFile(text, 'mi_lista_de_compras.txt', 'text/plain');
    });

    // Botón Borrar Lista
    borrarListaButton.addEventListener('click', () => {
        shoppingList.forEach(item => {
            if (item.type === 'item') {
                item.checked = false;
            }
        });
        renderList(shoppingList);
    });

    // Función para descargar un archivo
    function downloadFile(content, filename, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }
});