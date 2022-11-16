-- Database Schema for Cardiopathy Data

DROP TABLE IF EXISTS cardiopathy_type;
CREATE TABLE cardiopathy_type (
    id SMALLINT NOT NULL,
    cardiopathy_name VARCHAR(50) NOT NULL, --  0 = normal; 1 = fixed defect; 2 = reversable defect
    PRIMARY KEY (cardiopathy_id)
);

DROP TABLE IF EXISTS patients;
CREATE TABLE patients (
    id INTEGER NOT NULL,
    age INTEGER NOT NULL,
    sex SMALLINT NOT NULL, -- 0 or 1
    chest_pain SMALLINT NOT NULL, -- 0 or 1
    blood_pressure INTEGER NOT NULL, -- resting blood pressure
    cholesterol INTEGER NOT NULL, -- serum cholestoral in mg/dl
    blood_sugar SMALLINT NOT NULL, -- whether fasting blood sugar > 120 mg/dl
    resting_electro SMALLINT NOT NULL, -- 0, 1, 2
    max_heartrate  INTEGER NOT NULL, -- heartrate achieved
    angina SMALLINT NOT NULL, -- exercise induced angina
    st_oldpeak REAL NOT NULL, -- ST depression induced by exercise relative to rest
    st_slope SMALLINT NOT NULL, -- the slope of the peak exercise ST segment
    major_vessels SMALLINT NOT NULL, -- number of major vessels (0-3) colored by flourosopy
    cardiopathy_type SMALLINT NOT NULL, -- cardiopathy type
    target SMALLINT NOT NULL, -- presence of heart disease in the patient
    PRIMARY KEY (patient_id),
    CONSTRAINT fk_cardiopathy_type
        FOREIGN KEY (cardiopathy_id)
            REFERENCES cardiopathy_type(cardiopathy_id)
);