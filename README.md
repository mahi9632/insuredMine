# InsuredMINE Node.Js Assessement

Folder Structure:
Model 
model.Js : performing CRUD Operations 
routers
index.js : routing and API functions
service
agents.Js : businness logics and validations
utilities
connection.Js : defining schema,intigration of mangoose
	
app.Js : routins, middlewares  and server file

Steps :

Run “npm install” to install node modules.
Run node app.js to start serever
Run moniterCpu file to moniter the node server ( implimetnted till stoping server)

API’s:
http://localhost:3000/setupDB GET API o populate VSC data to Database.
http://localhost:3000/getPolicyInfo/Lura Lucca   GET API to find Policy Details using User’s first name.
	Note :  Lura Lucca is given User’s firstName to find Policy.
http://localhost:3000/message POST API to add message and timestamp.
	Note : Provide message and Body in Payload in Json format.
http://localhost:3000/getUsersPolicies/  GET  API to get aggregated policy by each user.
