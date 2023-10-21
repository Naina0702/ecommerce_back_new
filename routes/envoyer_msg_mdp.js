var express = require("express");
var router = express.Router();
const { HuaweiWingle4G } = require('huawei-wingle-4g');

const huaweiWingle4g = new HuaweiWingle4G('admin','admin');


router.post('/message',function(req,res){

    
    var phone = req.body.telephone;
    var content = req.body.contenu;

    var message_ = huaweiWingle4g.getSms();
    

    message_.sendSms(phone,content).then((reason,never)=>{
        
       res.send({
            message_success:"Message envoyé"
        });
    }).catch((never)=>{
        
        res.send({
            message_error:"Message non envoyé"
        });
        
        console.log(never)

    });
});
 
module.exports = router;