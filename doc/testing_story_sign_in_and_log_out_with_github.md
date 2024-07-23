# Testing Story: Sign in and log out with GitHub  

## Objective
Verify that a user can successfully sign in and log out using GitHub account.

## Pre-Conditions
The user has an active GitHub account.
The application has GitHub sign-in options enabled.

## Test Steps
1. Navigate to the application's login page.
2. Click on the "Sign in with GitHub" button. 
3. A GitHub login pop-up should appear. Enter valid GitHub credentials.
4. Click "Next" and then "Sign In" in the GitHub authentication pop-up.
5. Observe the behavior and note any error messages or redirects.
6. Ensure the user is logged into the application.
7. Navigate to the more page.
8. Click on the "Log out" button or link.
9. Observe the behavior and note any error messages or redirects.

## Expected Results
Sign-In:  
The user is successfully authenticated using GitHub credentials and redirected to the Entries page. 

Log-Out:  
The user is successfully logged out and redirected to the login page. No error messages should be displayed unless there is a failure in the log-out process. 

## Post-Conditions
The user should be redirected to the Entries page after successful authentication.
The user session should be maintained, and relevant user data should be fetched and displayed.
The user should be redirected to the application's login page after logging out.
The user session should be terminated.
