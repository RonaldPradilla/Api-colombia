const fetchPlatosColombianos = () => {
    const statusEl = document.getElementById('status');
    fetch('https://api-colombia.com/api/v1/TypicalDish')
        .then((res) => res.json())
        .then((data) => {
            if (statusEl) statusEl.style.display = 'none';
            const conteo = contarPorDepartamento(data);
            displayGrafico(conteo);
        })
        .catch((err) => {
            console.error("Error al obtener datos:", err);
            if (statusEl) {
                statusEl.textContent =
                    'Error al cargar los datos. Verifica tu conexión e intenta de nuevo.';
            }
        });
};

const contarPorDepartamento = (platos) => {
    const conteo = {};
    platos.forEach((plato) => {
        const dep = (plato.department && plato.department.name) ? plato.department.name : 'Sin departamento';
        conteo[dep] = (conteo[dep] || 0) + 1;
    });
    return conteo;
};

const displayGrafico = (conteo) => {
    const entradas = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
    const departamentos = entradas.map((e) => e[0]);
    const cantidades = entradas.map((e) => e[1]);

    const graficoEl = document.getElementById('grafico');
    if (!graficoEl) {
        console.error("No se encontró el elemento con ID 'grafico'");
        return;
    }

    const trace = {
        type: 'bar',
        x: departamentos,
        y: cantidades,
        text: cantidades.map(String),
        textposition: 'outside',
        marker: {
            color: cantidades,
            colorscale: [
                [0,   '#9FE1CB'],
                [0.5, '#1D9E75'],
                [1,   '#085041']
            ],
            showscale: false
        },
        hovertemplate: '<b>%{x}</b><br>Platos: %{y}<extra></extra>'
    };

    const layout = {
        xaxis: {
            title: { text: 'Departamento', font: { size: 14 } },
            tickangle: -40,
            automargin: true,
            tickfont: { size: 12 }
        },
        yaxis: {
            title: { text: 'Cantidad de platos', font: { size: 14 } },
            dtick: 1
        },
        margin: { t: 30, r: 30, b: 180, l: 60 },
        height: 520,
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
        font: { family: 'Arial, sans-serif' },
        bargap: 0.3
    };

    Plotly.newPlot('grafico', [trace], layout, {
        responsive: true,
        displayModeBar: false
    });
};

// Iniciar la carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', fetchPlatosColombianos);
