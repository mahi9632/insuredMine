var express = require('express');
var router = express.Router();
const service = require("../service/agents");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/setupDB", (req, res) => {
  service.insertScript().then((data) => {
      if (data) {
          res.status(201);
          res.json({ message: "Inserted " + data + " document in database" });
      }
  })
})


router.get("/getPolicyInfo/:username",(req,res,next)=>{
  let userName = req.params.username;
  service.getPolicyInfo(userName).then((policyInfo)=>{
    res.status(200);
    res.json(policyInfo);
  }).catch((error)=>{
    next(error);
  });
})




router.post("/message", (req, res, next) => {
  let messageObj = req.body
  service.addMessage(messageObj).then((data) => {
      res.json({ message: "message inserted Successfully" })
  }).catch((err) => {
      next(err)
  })
})




router.get("/getUsersPolicies",(req,res,next)=>{
  service.getUsersPolicies().then((UsersPolicies)=>{
    res.status(200);
    res.json(UsersPolicies);

  })

})

module.exports = router;
