# Machine Learning

Using Logistic Regression as a classifier


## Measurements

| 	| Predicted True	| Predicted False |
|---|---|---|   
|Actually True	|TRUE POSITIVE	|FALSE NEGATIVE|
|Actually False|	FALSE POSITIVE	|TRUE NEGATIVE|


#### Accuracy

tp + tn / (tp + tn + fp + fn)

Accuracy is the number of correct predictions against the total number of predictions.

#### Precision

tp / (tp + fp)

Precision is the measure of how likely is that the prediction is actually true. It tells us the percentage of positive predictions that are correct, how precise a positive prediction is.

#### Sensitivity

tp / (tp + fn)

Sensitivity is the capability of the model of understanding to which category the data corresponds.

```python
   precision    recall  f1-score   support

           0       0.88      0.72      0.79       125
           1       0.77      0.91      0.84       132

    accuracy                           0.82       257
   macro avg       0.83      0.81      0.81       257
weighted avg       0.83      0.82      0.82       257
```