# Testing Story: Sign in and log out with Google 

## Objective
Verify that a user can successfully sign in and log out using a Google account.

## Pre-Conditions
The user has an active Google account.
The application has Google sign-in options enabled.

## Test Steps
1. Navigate to the application's login page.
2. Click on the "Sign in with Google" button. 
3. A Google login pop-up should appear. Enter valid Google credentials.
4. Click "Next" and then "Sign In" in the Google authentication pop-up.
5. Observe the behavior and note any error messages or redirects.
6. Ensure the user is logged into the application.
7. Navigate to the more page.
8. Click on the "Log out" button or link.
9. Observe the behavior and note any error messages or redirects.

## Expected Results
Sign-In:  
The user is successfully authenticated using Google credentials and redirected to the Entries page. 

Log-Out:  
The user is successfully logged out and redirected to the login page. No error messages should be displayed unless there is a failure in the log-out process. 

## Post-Conditions
The user should be redirected to the Entries page after successful authentication.
The user session should be maintained, and relevant user data should be fetched and displayed.
The user should be redirected to the application's login page after logging out.
The user session should be terminated.
