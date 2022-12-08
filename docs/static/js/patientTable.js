// Fetch Patient Data from API
const fetchPatientData = (body) => {
    fetch(
        `${URL}/api/v1/patient/`, 
        {...POSTREQUEST, body:JSON.stringify(body)}
    )
    .then((response) => response.json())
    .then((patientData) => displayPatientDataInTable(patientData))
}
const fetchPatientDiagnosis = (body) => {
    fetch(
        `${URL}/api/v1/patient_diagnosis_main/`,
        {...POSTREQUEST, body:JSON.stringify(body)}
    )
    .then((response) => response.json())
    .then((diagnosisData) => displayPatientDiagnosis(diagnosisData))
}
const fetchPatientProcedure = (body) => {
    fetch(  
        `${URL}/api/v1/patient_surgical_procedure/`,
        {...POSTREQUEST, body:JSON.stringify(body)}
    )
    .then((response) => response.json())
    .then((procedureData) => displayPatientProcedure(procedureData))
}
const updatePatientData = (page) => {
    let body = getPatientRequestBody();
    fetchPatientData({...body, page: page});
}
// Patient Data Pagination variables
let patientPage = 0;
let patientTablePageNum = document.getElementById('patientTablePageNum');
patientTablePageNum.textContent = patientPage + 1;
// Handle Pagination Change
const nextPagePatientTable = () => {
    patientPage = patientPage === MAX_PAGES ? patientPage : patientPage + 1;
    patientTablePageNum.textContent = patientPage + 1;
    updatePatientData(patientPage);
}
const prevPagePatientTable = () => {
    patientPage = patientPage === MIN_PAGES ? patientPage : patientPage - 1;
    patientTablePageNum.textContent = patientPage + 1;
    updatePatientData(patientPage);
}
// HTML
let patientTable = document.getElementById('patientTableBody');
let loadingPatientTable = document.getElementById('loadingPatientTable');
let patientDiagnosis = document.getElementById('patientDiagnosis');
let patientProcedure = document.getElementById('patientProcedure');
// Update Patient Table HTML
const displayPatientDataInTable = (patientData) => {
    // Hide Loading Element
    loadingPatientTable.style.display = 'none';
    // Prepare Table Data
    patientTable.innerHTML = '';
    let patientIds = patientData.map((patient) => patient.patient_id);
    // Create cells
    patientData.map((patient) => {
        let tr = document.createElement('tr');
        delete patient.date_birth;
        delete patient.date_procedure;
        Object.entries(patient).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        })
        patientTable.append(tr);
    });
    // Fetch other data
    fetchPatientDiagnosis({patient_id: patientIds});
    fetchPatientProcedure({patient_id: patientIds});
}
// Update Patient Other Data HTML
const displayPatientDiagnosis = (data) => {
    patientDiagnosis.innerHTML = '';
    data.map((patient) => {
        patient.diagnosis_main.map((diagnosis) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = patient.patient_id;
            tr.append(td);
            let td2 = document.createElement('td');
            td2.textContent = diagnosis;
            tr.append(td2);
            patientDiagnosis.append(tr);
        })
    });
}
const displayPatientProcedure = (data) => {
    patientProcedure.innerHTML = '';
    data.map((patient) => {
        patient.surgical_procedure.map((procedure) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = patient.patient_id;
            tr.append(td);
            let td2 = document.createElement('td');
            td2.textContent = procedure;
            tr.append(td2);
            patientProcedure.append(tr);
        })
    });
}
// JQUERY
$(document).ready(function(){
    updatePatientData();
});
