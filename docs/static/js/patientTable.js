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
// Patient Data Pagination
const MAX_PAGES = 11;
const MIN_PAGES = 0;
let patientPage = 0;
let patientTablePageNum = document.getElementById('patientTablePageNum');
const nextPagePatientTable = () => {
    patientPage = patientPage === MAX_PAGES ? patientPage : patientPage + 1;
    patientTablePageNum.textContent = patientPage;
    updatePatientData(patientPage);
}
const prevPagePatientTable = () => {
    patientPage = patientPage === MIN_PAGES ? patientPage : patientPage - 1;
    patientTablePageNum.textContent = patientPage;
    updatePatientData(patientPage);
}
// HTML
let patientTable = document.getElementById('patientTableBody');
let patientDiagnosis = document.getElementById('patientDiagnosis');
let patientProcedure = document.getElementById('patientProcedure');
// Update Patient Table HTML
const displayPatientDataInTable = (patientData) => {
    patientTable.innerHTML = '';
    let patientIds = [];
    patientData.map((patient) => {
        let tr = document.createElement('tr');
        tr.innerHTML = '';
        Object.entries(patient).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        })
        patientIds.push(patient.patient_id);
        patientTable.append(tr);
    });
    fetchPatientDiagnosis({patient_id: patientIds});
    fetchPatientProcedure({patient_id: patientIds});
}
// Update Patient Other Data HTML
const displayPatientDiagnosis = (data) => {
    patientDiagnosis.innerHTML = '';
    data.map((patient) => {
        let tr = document.createElement('tr');
        Object.entries(patient).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        })
        patientDiagnosis.append(tr);
    });
}
const displayPatientProcedure = (data) => {
    patientProcedure.innerHTML = '';
    data.map((patient) => {
        let tr = document.createElement('tr');
        Object.entries(patient).forEach(([key, value]) => {
            let td = document.createElement('td');
            td.textContent = value;
            tr.append(td);
        })
        patientProcedure.append(tr);
    });
}
// JQUERY
$(document).ready(function(){
    updatePatientData();
});
