# ETL - Natural Language Processing

## Challenge

The data contains multiple columns that include Medical Notes in Natural Language, many of which have multiple irregularities as well as including more than one medical term. For example, in the case of surgical procedures, we get multiple procedures per surgery separated by a "+" delimiter.

```sql
kardias-2=# SELECT patient_id, surgical_procedure FROM clean OFFSET 15 LIMIT 5;
 patient_id |                           surgical_procedure                           
------------+------------------------------------------------------------------------
         14 | Reparación de CIV con parche + Cierre quirúrgico de Conducto Arterioso
         15 | Reparación de CIV, parche + Cierre primario de FOP
         16 | Cierre quirurgico de PCA
         17 | Reparación de CIA, parche
         18 | Cierre quirúrgico de PCA
```

## Result

The goal was to get to a normalized representation of each of these procedures as well as spreading the relationship with the patient id over many rows. 

```sql
kardias-2=# SELECT patient_id, surgical_procedure                                                                                            FROM patient_surgical_procedure                                                                                                              JOIN surgical_procedure                                                                                                                      ON surgical_procedure.token = patient_surgical_procedure.token                                                                               OFFSET 19 LIMIT 7;
 patient_id |           surgical_procedure            
------------+-----------------------------------------
         14 | Reparacion de CIV parche
         14 | Cierre quirurgico de Conducto Arterioso
         15 | Reparacion de CIV parche
         15 | Cierre primario de FOP
         16 | Cierre quirurgico de PCA
         17 | Reparacion de CIA parche
         18 | Cierre quirurgico de PCA
```

## Process

At a high level, the normalization process is to use a token representation from the original string and replace all other strings that share the same token representation with the first one. There are a few steps that must be taken in order to reach that normalization:

1. Remove letter symbols, like accents or non-unicode characters.
2. Remove punctuation symbols, like parentheses, comas, etc.
3. Change all words to lower case and remove stopwords, like "con", "el", "de".
4. Tokenize the previous step with a fuzzy string matching algorithm, like metaphone.

Here is the final result of the previous sequence, where we use the token as a Primary Key and keep the keywords as metadata. This includes steps we haven't talked about yet.

```sql
kardias-2=# SELECT * FROM surgical_procedure LIMIT 5;
    token     |    surgical_procedure    |       keywords        
--------------+--------------------------+-----------------------
 SSR          | Cierre de CIA            | cia cierre
 NRTPRSTMNT   | Procedimiento de Norwood | norwood procedimiento
 PLXTRKSPT    | Platia tricuspidea       | platia tricuspidea
 KLKSNKM      | Colocacion de ECMO       | colocacion ecmo
 MTRLFLFLPLSX | Valvuloplastia mitral    | mitral valvuloplastia
```

Note that we are missing one step in the normalization, which is the first description we gave for the process, using the token to normalize the original column.

## Inner Workings with Python

So far, we have only been viewing the SQL tables for the different stages of the process, but we haven't seen the code that creates them. In this section, we will explore the Python and Pandas methods used to achieve this. 

Before looking at the code, we must remember to keep the process consistent across all current and future records if we want not only to perform descriptive analysis, but also making predictions with a Machine Learning model. We are changing the representation of the original records in our database, so once we start fitting our model with this data, we would be changing the ground truth if we modify this ETL process. In order to reduce errors and improve collaboration, we bundled it all in a Python package: https://pypi.org/project/kardiasclean/

### Step 1: Load Data

We import the kardiasclean library which includes dependencies to NLTK and Phonetics.

```python
>>> import pandas as pd
>>> import kardiasclean
```

```python
>>> df = pd.read_csv('../database/data_clean1.csv')
>>> df[14:19][['patient_id','procedure']]
    patient_id                                          procedure
14          14  Reparación de CIV con parche + Cierre quirúrgi...
15          15  Reparación de CIV, parche + Cierre primario de...
16          16                           Cierre quirurgico de PCA
17          17                          Reparación de CIA, parche
18          18                           Cierre quirúrgico de PCA
```

### Step 2: Separate Individual Terms

We split the individual medical terms and then spread them over multiple rows.

```python
>>> df['procedure'] = kardiasclean.split_string(df['procedure'], delimiter='+')
>>> df['procedure'][14:19]
14    [Reparación de CIV con parche, Cierre quirúrgi...
15    [Reparación de CIV, parche, Cierre primario de...
16                           [Cierre quirurgico de PCA]
17                          [Reparación de CIA, parche]
18                           [Cierre quirúrgico de PCA]
Name: procedure, dtype: object
```

```python
spread_df = kardiasclean.spread_column(df['procedure'])
>>> spread_df[19:26]
    NaN                                procedure
19   14             Reparación de CIV con parche
20   14  Cierre quirúrgico de Conducto Arterioso
21   15                Reparación de CIV, parche
22   15                   Cierre primario de FOP
23   16                 Cierre quirurgico de PCA
24   17                Reparación de CIA, parche
25   18                 Cierre quirúrgico de PCA
```

### Step 3: Clean the Main Column

Then we remove extra information from the original column.

```python
>>> spread_df['procedure'] = kardiasclean.clean_accents(spread_df['procedure'])
>>> spread_df['procedure'] = kardiasclean.clean_symbols(spread_df['procedure'])
>>> spread_df[19:26]
    patient_id                                procedure
19          14             Reparacion de CIV con parche
20          14  Cierre quirurgico de Conducto Arterioso
21          15                 Reparacion de CIV parche
22          15                   Cierre primario de FOP
23          16                 Cierre quirurgico de PCA
24          17                 Reparacion de CIA parche
25          18                 Cierre quirurgico de PCA
```

### Step 4: Remove Stopwords

We create a new column with sorted keywords created from removing the stopwords. We want this to be sorted to improve the tokenization step.

```python
>>> spread_df['keywords'] = kardiasclean.clean_stopwords(spread_df['procedure'], language='spanish')
>>> spread_df[19:26]
    patient_id                                procedure                              keywords
19          14             Reparacion de CIV con parche                 civ parche reparacion
20          14  Cierre quirurgico de Conducto Arterioso  arterioso cierre conducto quirurgico
21          15                 Reparacion de CIV parche                 civ parche reparacion
22          15                   Cierre primario de FOP                   cierre fop primario
23          16                 Cierre quirurgico de PCA                 cierre pca quirurgico
24          17                 Reparacion de CIA parche                 cia parche reparacion
25          18                 Cierre quirurgico de PCA                 cierre pca quirurgico
```

### Step 5: Tokenize

We apply a metaphone algorithm from the Phonetics Python library on the keywords column but we store it in a separate column. Tokenizing the data in this way will give us a more robust representation, for example, it uses the same token for both "quirurgico" and "quirurgica".

```python
>>> spread_df['token'] = kardiasclean.clean_tokenize(spread_df['keywords'])
>>> spread_df[19:26][['patient_id', 'keywords', 'token']]
    patient_id                              keywords              token
19          14                 civ parche reparacion         SFPRXRPRSN
20          14  arterioso cierre conducto quirurgico  ARTRSSRKNTKTKRRJK
21          15                 civ parche reparacion         SFPRXRPRSN
22          15                   cierre fop primario           SRFPPRMR
23          16                 cierre pca quirurgico          SRPKKRRJK
24          17                 cia parche reparacion          SPRXRPRSN
25          18                 cierre pca quirurgico          SRPKKRRJK
```

### Step 6: Get Unique Values

We create a single source of "unique values", in this case the criteria defaults to the first record in the list that matches the unique token.

```python
list_df = kardiasclean.create_unique_list(spread_df, spread_df['token'])
>>> list_df[0:5]
   patient_id                                    procedure                                  keywords                  token
0           0                     Reparacion de CIA parche                     cia parche reparacion              SPRXRPRSN
1           5                     Reparacion de CIV parche                     civ parche reparacion             SFPRXRPRSN
2           5  Reparacion de estenosis aortica subvalvular  aortica estenosis reparacion subvalvular  ARTKSTNSSRPRSNSPFLFLR
3          12                     Cierre quirurgico de PCA                     cierre pca quirurgico              SRPKKRRJK
4          13            Reparacion de CIV cierre primario            cierre civ primario reparacion          SRSFPRMRRPRSN
```

### Step 7: Normalize

Finally, we use the tokens from the spread dataframe to lookup the new list of unique values, and, in this case, use the value in the "procedure" as the new value in the "procedure" column in the spread dataframe.

```python
>>> spread_df['procedure'] = kardiasclean.normalize_from_tokens(spread_df['token'], list_df['token'], list_df['procedure'])
>>> spread_df[19:26]
    patient_id                                procedure                              keywords              token
19          14                 Reparacion de CIV parche                 civ parche reparacion         SFPRXRPRSN
20          14  Cierre quirurgico de Conducto Arterioso  arterioso cierre conducto quirurgico  ARTRSSRKNTKTKRRJK
21          15                 Reparacion de CIV parche                 civ parche reparacion         SFPRXRPRSN
22          15                   Cierre primario de FOP                   cierre fop primario           SRFPPRMR
23          16                 Cierre quirurgico de PCA                 cierre pca quirurgico          SRPKKRRJK
24          17                 Reparacion de CIA parche                 cia parche reparacion          SPRXRPRSN
25          18                 Cierre quirurgico de PCA                 cierre pca quirurgico          SRPKKRRJK
```

## Summary

Having all code in Python helps gluing the process between all the steps in the data pipeline, from data cleaning to model training and Web APIs. Note that all of this could be done in via Pandas or any other combination of libraries, we just created an interface around it to improve readability and as a way to iterate over the same processes across different Data Analyst's notebooks, services, etc. 

In terms of the results, we managed to reduce the variance by about 20%, from 714 different procedures to 572. This process can always improve and it is open to special cases where we can include additional "stopwords" to remove in order to get a more homogeneous dataset.

```python
# spread_df before normalization
print(kardiasclean.get_unique_stats(spread_df))
                   patient_id   procedure    keywords       token
unique_count      1003.000000  714.000000  618.000000  572.000000
percent_of_total     0.603127    0.429345    0.371618    0.343957
avg_per_record       1.658026    2.329132    2.690939    2.907343
```

We also applied it to 4 other columns, including Appearance, Origins, Main (Cardiac) Diagnosis, and General Diagnosis, so we can design our database around the results and conform to at least 3NF.

```sql
kardias-2=# \dt
                      List of relations
 Schema |            Name            | Type  |     Owner     
--------+----------------------------+-------+---------------
 public | _api_keys                  | table | albertovaldez
 public | appearance                 | table | albertovaldez
 public | clean                      | table | albertovaldez
 public | diagnosis_general          | table | albertovaldez
 public | diagnosis_main             | table | albertovaldez
 public | origin                     | table | albertovaldez
 public | patient                    | table | albertovaldez
 public | patient_appearance         | table | albertovaldez
 public | patient_diagnosis_general  | table | albertovaldez
 public | patient_diagnosis_main     | table | albertovaldez
 public | patient_origin             | table | albertovaldez
 public | patient_surgical_procedure | table | albertovaldez
 public | surgical_procedure         | table | albertovaldez
```