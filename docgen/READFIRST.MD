### WINDOWS INSTRUCTIONS

After exporting the Postman json file (make sure everything is saved), change all instances of the {{URL}} varaibles to the correct localhost

Create a folder (docgen in this case) and move the exported file into there, as well as downloading the binary file from the docgen github

CD into that folder

Then run command

```
.\windows_amd64 build -i 10-E-Commerce.postman_collection.json -o index.html
```

This creates an html file that we can move into the public later, or serve up from here using path
