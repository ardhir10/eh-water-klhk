const query = require('./pgsqlquery');
var moment = require('moment')
const axios = require('axios');
const datetime = require('node-datetime');


module.exports.sendOnlimo = function sendOnlimo(urlOnlimo,idStasiunOnlimo,apiKeyOnlimo,apiSecretOnlimo,time,payload,statusSend = 1) {
    try {
        let dataInsertLogOnlimo = {};
        let dateTimeOnlimo = time.split(" ")
        let paramSendOnlimo = {};
        if(statusSend != 3){
            paramSendOnlimo = {
                "data": {
                    "IDStasiun": idStasiunOnlimo,
                    "Tanggal": dateTimeOnlimo[0],
                    "Jam": dateTimeOnlimo[1],
                    "Suhu": 0,
                    "DHL": 0,
                    "TDS": 0,
                    "Salinitas": 0,
                    "DO": payload.payload.nh3n,
                    "PH": payload.payload.pH,
                    "Turbidity": 0,
                    "Kedalaman": 0,
                    "SwSG": 0,
                    "Nitrat": 0,
                    "Amonia'": 0,
                    "ORP": 0,
                    "COD": payload.payload.cod,
                    "BOD": 0,
                    "TSS": payload.payload.tss
                },
                "apikey": apiKeyOnlimo,
                "apisecret": apiSecretOnlimo
            };
        }else{
            paramSendOnlimo = payload;
        }
       
        return new Promise(async (resolve, reject) => {
            try {
                let respOnlimo = await axios.post(urlOnlimo, paramSendOnlimo);
                let statusSendOnlimo = respOnlimo.data;
                // --- JIKA TERNYATA SUDAH ADA DATA
                if(typeof statusSendOnlimo ==='string'){
                    dataInsertLogOnlimo['created_at'] = time;
                    dataInsertLogOnlimo['decode_payload'] = paramSendOnlimo;
                    dataInsertLogOnlimo['response'] = {"msg":respOnlimo.data};
                    dataInsertLogOnlimo['status_send'] = statusSend;
                    console.log("--->[ONLIMO KLHK] DATA ONLIMO BERHASIL DIKIRIM")
                    if (statusSend != 3 ){
                        await query.insert('onlimo_logs', dataInsertLogOnlimo, function (res) {
                            console.log('--->[\x1b[36mPGSQL\x1b[0m] ' + res + ' (ONLIMO SAVE LOGS FROM FAIL :' + time + ')');
                            resolve(true)
                        });
                    }
                    
                }else{
                    if (statusSendOnlimo.status.statusDesc === 'OK') {
                        dataInsertLogOnlimo['created_at'] = time;
                        dataInsertLogOnlimo['decode_payload'] = paramSendOnlimo;
                        dataInsertLogOnlimo['response'] = respOnlimo.data;
                        dataInsertLogOnlimo['status_send'] = statusSend;
                        console.log("--->[ONLIMO KLHK] DATA ONLIMO BERHASIL DIKIRIM")
                    } else {
                        dataInsertLogOnlimo['created_at'] = time;
                        dataInsertLogOnlimo['decode_payload'] = paramSendOnlimo;
                        dataInsertLogOnlimo['response'] = respOnlimo.data;
                        dataInsertLogOnlimo['status_send'] = 0;
                        console.log("--->[ONLIMO KLHK] DATA ONLIMO GAGAL DIKIRIM 1")
                    }

                    await query.insert('onlimo_logs', dataInsertLogOnlimo, function (res) {
                        console.log('--->[\x1b[36mPGSQL\x1b[0m] ' + res + ' (ONLIMO SAVE LOGS :' + time + ')');
                        resolve(true)
                    });
                }
                
            } catch (error) {
                if (statusSend != 3){
                    dataInsertLogOnlimo['created_at'] = time;
                    dataInsertLogOnlimo['decode_payload'] = paramSendOnlimo;
                    dataInsertLogOnlimo['response'] = { 'msg': 'FAIL DATA' };
                    dataInsertLogOnlimo['status_send'] = 0;
                    console.log("--->[ONLIMO KLHK] DATA ONLIMO GAGAL DIKIRIM 2")
                    // console.log(error.message);
                    await query.insert('onlimo_fail_logs', dataInsertLogOnlimo, function (res) {
                        console.log('--->[\x1b[36mPGSQL\x1b[0m] ' + res + ' (ONLIMO SAVE FAIL LOGS :' + time + ')');
                    });
                    // console.log('--->SERVER ONLIMO GAK KONEK')
                    resolve(true)
                }
                resolve(true)
            }
           
        });

    } catch (error) {
        console.log('--->IN SEND ONLIMO')
        console.log(statusSend)
        console.log(error.message)
    }
}