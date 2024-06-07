
4D SIMULATION - CEINSYS

#### README #####
 

This project is basically a 4D Simulation which includes the visual representation of Point cloud along with a 3D Model made using Speckle and Potree.

The basic idea is integrating Speckle into our application that will show the 3D Point Cloud data along with it's model mapping.

This will include showing data(any model) in 3D format and then it's 3D point cloud data mapping.

We have used Three.js and Potree for Point Cloud Visualization.

Basically, a 3D Model file ( .obj format ) will be loaded in the 3D Viewer . Then this model will be converted as a Point Cloud data file ( .pcd format ).

The basic principle that this project fulfills is the side-by-side comparison of the 3D data and the actual point cloud data as a window partition.

So, on side you get to see a 3D model and on the other, you get the Point cloud visualization of the same model.

We have even integrated the Speckle Generic UI in our application which gives us the option to Load Point Cloud and 3D Model.


-------------------------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------------------------------------------------------

Steps to run the project : 

1. git clone https://github.com/VaibhavVDeshmukh/SpeckleVerse-Hackathon-ceinsys.git
2. cd speckle-server/packages/viewer-sandbox/public/potree
3. npm install
4. npm run build
5. cd speckle-server
7. corepack enable
8. yarn
9. yarn build
10. yarn dev:docker:up
11. cp packages/server/.env-example packages/server/.env
12. cp packages/server/.env.test-example packages/server/.env.test
13. cp packages/frontend-2/.env.example packages/frontend-2/.env
14. cp packages/dui3/.env.example packages/dui3/.env
15. yarn dev

