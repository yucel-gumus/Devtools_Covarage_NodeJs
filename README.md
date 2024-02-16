# puppeteer-coverage-report-test

Puppeteer script using Chrome's Coverage Report for CSS and JavaScript files. 
# Install
use "npm install" to install 
```
"fs": 
"puppeteer":
```

# How to run
Open index.js and setup the URLs you want to test, some projectname:

```javascript
const projectname = "unusedFindNodeJS"
const urlToTest = [
    "example.com",
]
```
npm run dev 

Start the script with 
```
node index.js
```

# Results 
The script will create a folder 
```
/results/#your-filename#/
```

Within the folder you will find data.csv 
