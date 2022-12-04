"""
Utility script to fix non-clean data.

run from the root directory:

    python database/scripts/fix_stay_days.py
"""
import pandas as pd
from pathlib import Path


def replace_negative_numbers_with_mean(
    colname: str = "stay_days",
    files: list = [
        "./database/clean2/db_patient.csv",
    ]
):
    for file in files:
        df = pd.read_csv(Path(file).resolve())
        mean = df[colname][df[colname] >= 0].describe()['mean']
        df[colname] = df[colname].map(lambda x: x if x >= 0 else round(mean))
        df.to_csv(file, index=False)


if __name__ == "__main__":
    replace_negative_numbers_with_mean()