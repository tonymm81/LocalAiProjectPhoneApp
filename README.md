## This is phone app for my local ai project

- This app has similar ui that in local ai project desktopapp.py file. This is just for communication to local ai and check also the analytics data.


## version 100
- created /services/api.ts what handles the api calls
- Created /hooks/useLocalAI.ts service what handles the prompt sendind and parsing the responses and control states like result, analytics, loading, error and request id
- Created the ui view /components/promptWindow.tsx where is input field, where user can write the prompt and send a file and cancel the answer if wanted. Here is also view, where agent answer is printing.
-  created the ui /components/analytics.tsx view, where user can inspect the agent answer analytics data
- created /navigator/appnavigator.tsx, what handles the navigation in project
