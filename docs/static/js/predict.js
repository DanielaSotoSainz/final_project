// Form Dropdown constants
const VALID_PROCEDURES = [
    "Parche comunicacion interauricular CIA",
    "Vena cava inferior parche",
    "Cierre de Conducto Arterioso",
    "Reparacion de Canal AV",
    "Reparacion de Tetralogia de Fallot",
    "Procedimiento de Glenn",
    "Reparacion de arco aortico",
    "Fistula sistemico pulmonar",
    "Procedimiento de Fontan",
    "Other_Procedure",
]
const VALID_DIAGNOSIS = [
    "CIA",
    "CIV",
    "Estenosis",
    "PCA",
    "Coartacion Aortica",
    "Tetralogia de Fallot",
    "Atresia",
    "Post-Surgical Procedure",
    "Hipoplasia",
    "Other_Diagnosis",
]
let selectProcedure = document.getElementById('selectProcedure');
let selectDiagnosis = document.getElementById('selectDiagnosis');
var clusterTableObject = undefined;
// FETCH
const fetchClusterTable = () => {
    fetch(`${URL}/api/v1/ml/kmeans/clusters`, GETREQUEST)
    .then((response) => response.json())
    .then((clusterTable) => {
        clusterTableObject = {...clusterTable}; // store in global
        displayClusterTableData(clusterTable);
        plotClusters([clusterTable, 0, 0]);
    })
}
const fetchKMeansPredict = (body) => {
    fetch(
        `${URL}/api/v1/ml/kmeans/predict`, 
        {...POSTREQUEST, body:JSON.stringify(body)}
    )
    .then((response) => response.json())
    .then((prediction) => (updateClusterResult(prediction.cluster)))
}

// Patient Cluster Form Options
const createProcedureOptions = () => {
    VALID_PROCEDURES.map(procedure => {
        let opt = document.createElement('option');
        opt.setAttribute('value', procedure)
        opt.textContent = procedure;
        selectProcedure.append(opt);
    })
}
const createDiagnosisOptions = () => {
    VALID_DIAGNOSIS.map(diagnosis => {
        let opt = document.createElement('option');
        opt.setAttribute('value', diagnosis)
        opt.textContent = diagnosis;
        selectDiagnosis.append(opt);
    })
}
// Patient Cluster Data for Form 
const POST_PREDICT_KMEANS = {
    gender: 0,
    age_days: 450,
    weight_kg: 8,
    height_cm: 60,
    cx_previous: 0,
    rachs: 2,
    diagnosis_main: [
        VALID_DIAGNOSIS[0]
    ],
    surgical_procedure: [
        VALID_PROCEDURES[0]
    ],
}
// HTML form
let kmeansForm = document.getElementById('kmeansForm');

// Fetch data from Form values TODO: validate
const submitPatientClusterForm = () => {
    // Update elements loading
    clusterResult.style.display = 'none';
    loadingClusterResult.style.display = 'block';
    // Validate and obtain form data
    const {valid, body} = validatePatientClusterForm(kmeansForm.elements);
    // Fetch
    if (valid) fetchKMeansPredict(body);
}
// Form validation and processing
const validatePatientClusterForm = (data) => {
    // TODO: Add actual Validation
    // Create request body
    let body = {
        gender: data.gender.value,
        age_days: data.age_days.value,
        weight_kg: data.weight_kg.value,
        height_cm: data.height_cm.value,
        cx_previous: data.cx_previous.value,
        rachs: data.rachs.value,
        diagnosis_main: [data.selectDiagnosis.value],
        surgical_procedure: [data.selectProcedure.value],
    }
    return {valid: true, body: body};
}

// DEFAULTS
const setFormDefaults = (defaults) => {
    // Manually set defaults from constant
    kmeansForm.elements.gender.value = defaults.gender;
    kmeansForm.elements.age_days.value = defaults.age_days;
    kmeansForm.elements.weight_kg.value = defaults.weight_kg;
    kmeansForm.elements.height_cm.value = defaults.height_cm;
    kmeansForm.elements.cx_previous.value = defaults.cx_previous;
    kmeansForm.elements.rachs.value = defaults.rachs;
    kmeansForm.elements.selectDiagnosis.value = defaults.diagnosis_main[0];
    kmeansForm.elements.selectProcedure.value = defaults.surgical_procedure[0];
}

// Cluster Table
let clusterTableBody = document.getElementById('clusterTableBody');
let loadingClusterTableBody = document.getElementById('loadingClusterTableBody');

// Populate Table with rows
const displayClusterTableData = (clusterData) => {
    // Hide Loading element
    loadingClusterTableBody.style.display = 'none';
    // Reset table contents and create row per record
    clusterTableBody.innerHTML = '';
    clusterData.clusters.map((cluster) => {
        // Create cluster and add id
        let tr = document.createElement('tr');
        tr.id = `k-${cluster.cluster}`;
        // Don't include extra data
        // delete cluster.expired;
        delete cluster.weight_kg;
        delete cluster.height_cm;
        // Create cells
        Object.entries(cluster).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        });
        clusterTableBody.append(tr);
    });
}

// Cluster Result
let clusterResult = document.getElementById('clusterResult');
let loadingClusterResult = document.getElementById('loadingClusterResult');
let predictedCluster = 1;

// Update Cluster Result
const updateClusterResult = (cluster) => {
    // Reset Table
    document.getElementById(`k-${predictedCluster}`).className = '';
    // Update Cluster global
    predictedCluster = cluster;
    // Update Elements loading
    loadingClusterResult.style.display = 'none';
    clusterResult.style.display = 'block';
    clusterResult.textContent = predictedCluster;
    // Update Table
    document.getElementById(`k-${predictedCluster}`).className='table-primary';
    // Redraw Figure with Patient
    const index = clusterTableObject.clusters.findIndex((cluster) => cluster.cluster == predictedCluster);
    const [x, y] = [clusterTableObject.clusters[index].rachs, clusterTableObject.linear_regression[index]]
    plotClusters([clusterTableObject, x, y]);
}

// Visualization Clusters
let loadingClusterPlot = document.getElementById('loadingClusterPlot');

const plotClusters = ([clustersData, patientX, patientY]) => {
    // Hide Loading element
    loadingClusterPlot.style.display = 'none';
    // Create arrays for traces
    let rachs = clustersData.clusters.map((cluster) => cluster.rachs);
    let stay_days = clustersData.clusters.map((cluster) => cluster.stay_days);
    let n_patients = clustersData.clusters.map((cluster) => cluster.n_patients/2);
    // Trace for Scatter
    var trace1 = {
        x: rachs,
        y: stay_days,
        mode: 'markers',
        name: 'Cluster',
        opacity: 0.8,
        marker: {
            color: [
                'rgb(93, 164, 214)', 
                'rgb(255, 144, 14)',  
                'rgb(44, 160, 101)', 
                'rgb(255, 65, 54)',
                'rgb(120, 50, 180)',
                'rgb(200, 20, 100)',
                'rgb(100, 200, 100)',
                'rgb(20, 150, 100)',
                'rgb(250, 200, 50)',
                'rgb(250, 200, 200)',
            ],
            size: n_patients,
        },
    };
    // Trace for Line
    var trace2 = {
        x: rachs,
        y: clustersData.linear_regression,
        mode: 'lines',
        name: 'Linear Regression',
        hoverinfo: 'skip',
        marker: {
            color: 'gray'
        },
    }
    // Trace for patient
    if (patientX == 0 && patientY == 0){
        var clustersData = [trace1, trace2];
    }
    else {
        var tracePatient = {
            x: [patientX],
            y: [patientY],
            mode: 'markers',
            name: 'Patient',
            opacity: 1,
            marker: {
                symbol: ["diamond"],
                color: [
                    'rgb(60, 80, 200)', 
                ],
                size: 20,
            },
        };
        var clustersData = [trace1, trace2, tracePatient];
    }
    var layout = {
        title: 'Avg. Rachs Score v.s. Avg. ICU Stay Days',
        showlegend: false,
        height: 500,
        width: 800,
        xaxis: {
            title: {
              text: 'Rachs',
              font: {
                size: 16,
              }
            },
        },
        yaxis: {
        title: {
            text: 'Stay Days',
            font: {
            size: 16,
            }
        }
        }
    };
    var config = {responsive: true} 
    Plotly.newPlot('clusterPlot', clustersData, layout, config);
}
// JQUERY
$(document).ready(function(){
    createProcedureOptions();
    createDiagnosisOptions();
    setFormDefaults(POST_PREDICT_KMEANS);
    fetchClusterTable();
});