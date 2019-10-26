# UCF CAP4720 Introduction to Computer Graphics - Fall 2019
### Course on Introduction to Computer Graphics using WebGL with Dr. Sumanta Pattanaik in Fall 2019
## Contents

### Assignments
   * Assignment 1 - Load and render Object using **ObjectLoader**
   * Assignment 2 - Use **dat.GUI** to control lighting in the scene
   * Assignment 3 - Use **dat.GUI** for scaling, rotation and translation
   of an object in the scene
   * Assignment 4 - GLSL Shader equivalent to THREE.MeshNormalMaterial
   * Assignment 5 - GLSL Shader for Hemisphere Lighting

## Running the code

#### For each Assignment or Project, you will need all files in the folder to get the scene to render. Clone the entire repository, or download files one by one, but make sure you have all files for each Assignment scene you want to view. 

#### The JavaScript code in Assignments and Project requires running on a server, as it loads an object from local files. Below are the simplest ways to run the code (assuming you cloned the repository)

   1) Using Visual Studio Code, install [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) then open the `.html` file you want to view and run the extension. Atom and other code editors have their own extension for hosting a local sever.
   
   2) Using Chrome Browser, install [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en). Run the extension, pick the folder to be hosted and go to [http://127.0.0.1:8887/](http://127.0.0.1:8887/) by default.

   3) Using Python 2, navigate to a wanted folder in command line, then run   
   `python2 -m SimpleHTTPServer 8000`
   
   4) Using Python 3, navigate to a wanted folder in command line, then run   
   `python3 -m http.server 8000`
