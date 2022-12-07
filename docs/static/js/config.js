/**
 * Config Variables for API connectivity.
 */
const URL = "https://fxnqc075vd.execute-api.us-east-1.amazonaws.com/dev";
// const URL = "http://localhost:8000";
// Table limits
const MAX_PAGES = 9;
const MIN_PAGES = 0;
// Patient Request
const PatientRequest = {
    "amount": 5,
    "page": 0,
    "columns": {
        "gender": {
            "min": 0,
            "max": 1
        },
        "age_days": {
            "min": 0,
            "max": 36500
        },
        "weight_kg": {
            "min": 0,
            "max": 200
        },
        "height_cm": {
            "min": 0,
            "max": 2000
        },
        "cx_previous": {
            "min": 0,
            "max": 10
        },
        "date_birth": {
            "min": "1900-01-01",
            "max": "2100-01-01"
        },
        "date_procedure": {
            "min": "2000-01-01",
            "max": "2100-01-01"
        },
        "rachs": {
            "min": 0,
            "max": 6
        },
        "stay_days": {
            "min": 0,
            "max": 500
        },
        "expired": {
            "min": 0,
            "max": 1
        }
    }
}
const getPatientRequestBody = () => {
    return {...PatientRequest}
}
// REQUESTS
const TOKEN = 'ilovetableau99';
const POSTREQUEST = {
    method: 'POST',
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
      'access_token': TOKEN,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: '{}'
}
const GETREQUEST = {
    method: 'GET',
    mode: 'cors', 
    cache: 'no-cache',
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json',
      'access_token': TOKEN,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
}