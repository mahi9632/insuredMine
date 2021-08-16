const db = require("../model/model");

let service = {}
service.insertScript = () => {
    return db.insertScript().then((data) => {
        return data;
    })
}

service.getPolicyInfo = (userName) => {
    return db.getUser(userName).then((data) => {
        if (data.length > 0) {
            let userId = data[0].userId
            return db.getPolicyInfo(userId).then((PolicyData) => {
                if (PolicyData.length > 0) {
                    let firstname = data[0].firstname;
                    let userPolicyData = {};
                    userPolicyData[firstname] = PolicyData
                    return userPolicyData;
                } else {
                    let err = new Error("No PolicyInfo details found or operation failed");
                    err.status = 500;
                    throw err;
                }
            });
        } else {
            let err = new Error("User not found or operation failed");
            err.status = 500;
            throw err;
        }

    });
}





service.addMessage = (messageObj) => {
    return db.addMessage(messageObj).then((data) => {
        if (data) {
            return data;
        } else {
            let error = new Error;
            error.status = 500;
            throw error;
        }
    });
}

service.getUsersPolicies = () => {
    return db.getUsersPolicies().then((data) => {
        let policyData = {};
        data.map((obj) => {
            policyData[obj.firstname] = obj.policies
        })
        return policyData;
    })
}


module.exports = service