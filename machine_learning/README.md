# Machine Learning Predictions

## KMeans Clustering

### Features

```python
[
   'gender', 
   'age_days', 
   'weight_kg', 
   'height_cm',
   'cx_previous', 
   'rachs', 
   'stay_days', 
   'CIA', 
   'CIV',
   'Estenosis', 
   'PCA',
   'Other_Diagnosis', 
   'Coartacion Aortica', 
   'Tetralogia de Fallot',
   'Atresia', 
   'Post-Surgical Procedure', 
   'Hipoplasia',
   'Parche comunicacion interauricular CIA', 
   'Vena cava inferior parche',
   'Other_Procedure', 
   'Cierre de Conducto Arterioso',
   'Reparacion de Canal AV', 
   'Reparacion de Tetralogia de Fallot',
   'Procedimiento de Glenn', 
   'Reparacion de arco aortico',
   'Fistula sistemico pulmonar',
   'Procedimiento de Fontan',
]
```

## Summary
So how can we use Machine Learning to improve clinical decision-making?

We chose to focus on predicting two variables:

Mortality Rate and Number of days that the patient will stay in the Intensive Care Unit. 

In the case of a Neural Network, we get high accuracy but low sensitivity. Turns out that having a low representation of positives in our population doesn’t help on getting a good sensitivity score. Here is the prediction matrix after a few iterations of trying to improve the model performance. 

We used K-Means clustering to help us understand the relationship between all the variables and reduce the dimensions of our data, so whenever we get a new patient, we can input their data and get a corresponding cluster with an approximate number of stay days.
Finally, as a way to assist the interpretation of the clusters, we used Linear Regression on the Rachs score and the Stay Days for each cluster, which showed a fairly good relationship between the chosen variables.

We can always improve the outliers before and after the clustering as well as focusing on more accurate categorization of the Diagnosis and Procedure data by consulting medical experts.


