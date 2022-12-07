// DROPDOWN
const VALID_PROCEDURES = [
    "Parche comunicacion interauricular CIA",
    "Vena cava inferior parche",
    "Other_Procedure",
    "Cierre de Conducto Arterioso",
    "Reparacion de Canal AV",
    "Reparacion de Tetralogia de Fallot",
    "Procedimiento de Glenn",
    "Reparacion de arco aortico",
    "Fistula sistemico pulmonar",
    "Procedimiento de Fontan",
]
const VALID_DIAGNOSIS = [
    "CIA",
    "CIV",
    "Estenosis",
    "PCA",
    "Other_Diagnosis",
    "Coartacion Aortica",
    "Tetralogia de Fallot",
    "Atresia",
    "Post-Surgical Procedure",
    "Hipoplasia",
]
let selectProcedure = document.getElementById('selectProcedure');
let selectDiagnosis = document.getElementById('selectDiagnosis');
let clusterResult = document.getElementById('clusterResult');

// FETCH
const fetchClusterTable = () => {
    fetch(`${URL}/api/v1/ml/kmeans/clusters`, GETREQUEST)
    .then((response) => response.json())
    .then((tableData) => {
        displayClusterTableData(tableData);
        plotClusters(tableData);
    })
}
const fetchKMeansPredict = (body) => {
    fetch(
        `${URL}/api/v1/ml/kmeans/predict`, 
        {...POSTREQUEST, body:JSON.stringify(body)}
    )
    .then((response) => response.json())
    .then((prediction) => (clusterResult.textContent = prediction.cluster))
}

// OPTIONS
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

// CLUSTER FORM
let kmeansForm = document.getElementById('kmeansForm');
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
const validateFormOnSubmit = () => {
    clusterResult.textContent = "...";
    let diagnosis = [kmeansForm.elements.selectDiagnosis.value];
    let procedure = [kmeansForm.elements.selectProcedure.value];
    let body = {
        gender: kmeansForm.elements.gender.value,
        age_days: kmeansForm.elements.age_days.value,
        weight_kg: kmeansForm.elements.weight_kg.value,
        height_cm: kmeansForm.elements.height_cm.value,
        cx_previous: kmeansForm.elements.cx_previous.value,
        rachs: kmeansForm.elements.rachs.value,
        diagnosis_main: diagnosis,
        surgical_procedure: procedure,
    }
    fetchKMeansPredict(body);
}

// DEFAULTS
const setFormDefaults = () => {
    kmeansForm.elements.gender.value = POST_PREDICT_KMEANS.gender;
    kmeansForm.elements.age_days.value = POST_PREDICT_KMEANS.age_days;
    kmeansForm.elements.weight_kg.value = POST_PREDICT_KMEANS.weight_kg;
    kmeansForm.elements.height_cm.value = POST_PREDICT_KMEANS.height_cm;
    kmeansForm.elements.cx_previous.value = POST_PREDICT_KMEANS.cx_previous;
    kmeansForm.elements.rachs.value = POST_PREDICT_KMEANS.rachs;
    kmeansForm.elements.selectDiagnosis.value = POST_PREDICT_KMEANS.diagnosis_main[0];
    kmeansForm.elements.selectProcedure.value = POST_PREDICT_KMEANS.surgical_procedure[0];
}

// Cluster Table
let clusterTable = document.getElementById('clusterTableBody');
const displayClusterTableData = (clusterData) => {
    clusterTable.innerHTML = '';
    clusterData.clusters.map((cluster) => {
        let tr = document.createElement('tr');
        tr.innerHTML = '';
        delete cluster.expired;
        delete cluster.weight_kg;
        delete cluster.height_cm;
        Object.entries(cluster).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        })
        clusterTable.append(tr);
    });
}

const plotClusters = (data) => {
    let rachs = data.clusters.map((cluster) => cluster.rachs);
    let stay_days = data.clusters.map((cluster) => cluster.stay_days);
    let age_days = data.clusters.map((cluster) => cluster.n_patients/2);

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
            size: age_days,
        }
    };
    var trace2 = {
        x: rachs,
        y: data.linear_regression,
        mode: 'lines',
        name: 'Linear Regression',
        marker: {
            color: 'gray'
        }
    }
    
    var data = [trace1, trace2];
    
    var layout = {
        title: 'K-Means Clusters',
        showlegend: false,
        height: 500,
        width: 800,
        xaxis: {
            title: {
              text: 'Rachs',
              font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
              }
            },
        },
        yaxis: {
        title: {
            text: 'Stay Days',
            font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
            }
        }
        }
    };
    var config = {responsive: true} 
    Plotly.newPlot('clusterPlot', data, layout, config);
}

// JQUERY
$(document).ready(function(){
    createProcedureOptions();
    createDiagnosisOptions();
    setFormDefaults();
    fetchClusterTable();
});