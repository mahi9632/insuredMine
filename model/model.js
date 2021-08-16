
const collection = require("../utilities/connection");
let model = {}
const path = require("path");
const fs = require("fs");
const fastcsv = require("fast-csv");
const csv = require('csv-parser');
const customId = require("custom-id")







function converData() {
    let csvData = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(path.resolve(__dirname, "./data.csv"))
            .pipe(csv())
            .on('error', error => {
                reject(error);
            })
            .on('data', function (data) {
                try {
                    let userId = customId({ name: data.agent, email: "78910" });
                    let collection_id = customId({ policy_number: data.policy_number });
                    let company_collection_id = customId({ name: data.company_name });
                    csvData.push({
                        "userId": userId,
                        "agentname": data.agent,
                        "firstname": data.firstname, "dob": data.dob, "address": data.address, "phone_number": data.phone,
                        "state": data.state, "zip_code": data.zip, "email": data.email, "gender": data.gender, "userType": data.userType
                        ,
                        "user_Account": data.account_name,
                        "policy_Category": data.category_name,
                        "policy_Carrier": data.company_name,
                        "policy_number": data.policy_number, "policy_start_date": data.policy_start_date, "policy_end_date": data.policy_end_date,
                        "policy_category": data.category_name, "collection_id": collection_id, "company_collection_id": company_collection_id, "user_id": userId

                    });
                }

                catch (err) {
                    console.log(err);
                }




            })
            .on("end", function () {

                resolve(csvData);
            });

    });

}



async function getData() {
    let collection_names = ["agent", "user", "user_Account", "lob", "carrier", "policy"]
    try {
        const streamedData = await converData();
        // console.log(JSON.stringify(streamedData) + "gg");

        return Promise.all(collection_names.map((collection_name) => {
            return collection.getCollection(collection_name).then((collection) => {
                console.log(collection);
                return collection.deleteMany().then((data) => {
                    return collection.insertMany(streamedData).then((response) => {

                        if (response && response.length > 0) {
                            return response.length;
                        } else {
                            let err = new Error("Script insertion failed");
                            err.status = 500;
                            throw new Error;
                        }
                    })
                })
            })
        }));
    } catch (error) {
        console.error("testGetData: An error occurred: ", error.message);
    }
}



model.insertScript = () => {
    return getData();
}


model.getUser = (userName) => {
    return collection.getCollection("user").then((collectionName) => {
        return collectionName.find({ firstname: userName }, { _id: 0, userId: 1,firstname:1 }).then((data) => {
            return data;
        })
    })
}


model.getPolicyInfo = (userId) => {
    return collection.getCollection("policy").then((collectionName) => {
        return collectionName.find({ userId: userId }).then((data) => {
            return data;
        })
    })
}


let sceduledTask = function (data) {
    return collection.getCollection('scheduledMessages').then((collection) => {
        console.log(data);
        return collection.insertMany(data).then((insertedData) => {
            return insertedData;
        });
    })

}

model.addMessage = (messageObj) => {
    return collection.getCollection('message').then((collectionName) => {
        return collectionName.insertMany(messageObj).then((data) => {
            if (data) {
                collectionName.find({ timeStamp: messageObj.timeStamp }, { _id: 0 }).then((data) => {
                    collection.schedulMessage(data, sceduledTask);
                })
                return data
            } else {
                let error = new Error;
                error.status(500);
                throw new Error;
            }
        })

    })
}

model.getUsersPolicies = () => {
    return collection.getCollection('user').then((collectionName) => {
        return collectionName.aggregate([
            { $lookup: { from: "policies", localField: "userId", foreignField: "userId", as: "policies" } },
        ]).then((data) => {
            return data
        })
    })

}




module.exports = model
