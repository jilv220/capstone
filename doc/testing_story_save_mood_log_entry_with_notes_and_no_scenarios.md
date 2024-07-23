# Testing Story: Save Mood Log Entry with Notes and No Scenarios 

## Objective
Verify that a user cannot save a mood log entry with notes added but no scenarios selected.

## Pre-Conditions
The scenario selection and note editing page is open.

## Test Steps
1. Enter a note in the "Quick Note..." text box.
2. Click on the "Save" button (represented by an arrow) without selecting any scenarios. 
3. Observe the behavior and note any transitions or errors.

## Expected Results
The "Save" button (represented by an arrow) remains disabled when no scenarios are selected, regardless of whether a note is added. 

The user is unable to save a mood log entry without selecting at least one scenario, even if a note is added. 

## Post-Conditions
The mood log entry should not be saved since no scenarios are selected.
