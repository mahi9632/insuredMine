const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema
mongoose.set("useCreateIndex",true)
const Agenda = require('agenda');
const { MongoClient } = require('mongodb');
const schedule = require('node-schedule');


let uri = "mongodb://localhost:27017/AgentsDb";

function getSchema(collection) {

    if (collection == "agent") {
        let agent_Schema = new Schema({
            "agentname": {
                type: String
            }

        })
        return agent_Schema;
         
    }
    else if (collection == "user") {
        let user_Schema = new Schema({

            "userId":{
                type: String
            },
            "firstname": {
                type: String
            },
            "dob": {
                type: Date
            },
            "address": {
                type: String
            },
            "phone_number": {
                type: String
            },
            "state": {
                type: String
            },
            "zip_code": {
                type: String
            },
            "email": {
                type: String
            },
            "gender": {
                type: String
            },
            "userType": {
                type: String
            }


        })
        return user_Schema;
    }


    else if (collection == "user_Account") {
        let user_Account_Schema = new Schema({
            "user_Account": {
                type: String
            }

        })
        return user_Account_Schema;
    }

    else if (collection == "lob") {
        let lob_Schema = new Schema({
            "policy_Category": {
                type: String
            }
        })
        return lob_Schema;
    }


    else if (collection == "carrier") {
        let policy_Carrier_Schema = new Schema({
            "policy_Carrier": {
                type: String
            },
            "company_collection_id":{
                type: String
            }
            })
        return policy_Carrier_Schema;
    }




    else if (collection == "policy") {
        let policy_Schema = new Schema({


            "policy_number": {
                type: String
            },
            "policy_start_date": {
                type: Date
            },
            "policy_end_date": {
                type: Date
            },
            "policy_category": {
                type: String
            },
            "collection_id": {
                type: String
            },
            "company_collection_id": {
                type: String
            },
            "userId": {
                type: String
            },
            "collection_id":{
                type: String
            },
        })
        return policy_Schema;
    }

    else if (collection == "message") {
        let message_Schema = new Schema({
            "message": {
                type: String
            },
            "timeStamp":{
                type: String
            }
            })
        return message_Schema;
    }

    else if (collection == "scheduledMessages") {
        let scheduled_Messages_message_Schema = new Schema({
            "message": {
                type: String
            },
        })
        return scheduled_Messages_message_Schema;
    }
}



let connection = {}


















connection.getCollection = (collection)=>{
    return mongoose.connect(uri,{useNewUrlParser:true}).then((db)=>{


        try{
            return db.model(collection,getSchema(collection));
            }catch(err){
                if(err.name == "MissingSchemaError"){
                    return db.model(collection,getSchema(collection));
                }else if(err.name == "OverwriteModelError"){
                    return db.model(collection);
                }
            } 
    
    }).catch((err)=>{
        let error = new Error("could not  connect  to database")
        error.status = 500
        throw error   
    })
}



connection.schedulMessage = (getData,sceduledTask) =>{
    // console.log(getData[0].timeStamp);
    const timeStamp = getData[0].timeStamp
    schedule.scheduleJob(timeStamp, function(){
        console.log('The message added succefully on time.');
        return sceduledTask(getData)
      });
   
}


connection.checkCollection = (collection,schemaName)=>{
    return mongoose.connect(uri,{useNewUrlParser:true}).then((db)=>{
        try{
        return schemaName?db.model(collection,getSchema(schemaName)):db.model(collection)
        }catch(err){
            if(err.name == "MissingSchemaError"){
                return schemaName?db.model(collection,getSchema(schemaName)): db.model(collection,getSchema(collection));
            }
        }
    }).catch((err)=>{
        
        let error = new Error("could not  connect  to database for message collection")
        error.status = 500
        throw error
       
    })
}




module.exports = connection