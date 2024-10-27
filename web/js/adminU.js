function validarClave() {
    const claveSecreta = document.getElementById('claveSecretaInput').value;

    fetch('/validar-clave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ claveSecreta: claveSecreta })
    })
    .then(response => response.json())
    .then(data => {
        if (data.accesoPermitido) {
            // Oculta el modal y muestra el contenido
            document.getElementById('claveModal').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        } else {
            // Muestra un mensaje de error
            document.getElementById('errorClave').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
}
