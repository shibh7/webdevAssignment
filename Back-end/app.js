let http = require('http');
let mysql = require("mysql");
let url = require('url');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment"
});

let requests = 0;


let server = http.createServer(function(req, res) {
    requests++;
    console.log(requests)
    console.log(req)
    console.log(req.method)
    if(req.method === "GET"){
        let questionBank = [];
        const q = url.parse(req.url, true);
        if(q.pathname == "/questions"){      
            
            let sql = "SELECT * FROM questions";
            con.query(sql, function(err, result, fields){
                if (err) throw err;
                else{
                    for(let i = 0; i < result.length; i++){
                        let questionID = result[i].questionID;
                        let question = {"questionID": result[i].questionID, "questiondesc" : result[i].questionDesc}
                        let ans = "SELECT * FROM answers WHERE questionID = " + questionID;
                        let answers = [];
                        con.query(ans, function(err2, result2, fields){
                            if (err2) throw err2;
                            else{
                                let correctAns
                                let totalAns = result2.length;
                                for(let j = 0; j < totalAns; j++){
                                    let answer = {"answerID": result2[j].answerID, "answerdesc": result2[j].answer};
                                    answers[j] = answer;
                                    if(result2[j].correct_answer == 1){
                                        correctAns = {"correctAns": result2[j].answer }
                                    }
                                }
                                let object = {"Question" : question, "Answer": answers, "correctAns": correctAns}
                                questionBank[i] = object;
                            }
                             
                            if(i == (result.length - 1)){
                                let quiz = JSON.stringify(questionBank);
                                
                                res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin':'*'});
                                res.write(quiz);
                                res.end();
                            }
                        });
                    }

                }
            });
        }
        console.log("request served")

    }else if(req.method == "POST"){
        const q = url.parse(req.url, true);
        console.log(q.pathname)
        if(q.pathname == "/questions"){
            var json = '';
            req.on('data', function (chunk){
                json += chunk.toString('utf8');
            });
            req.on('end', function (){
                console.log(json);
                var jsonObj = JSON.parse(json);
                console.log(jsonObj);
                let question = jsonObj[0].question;
                let answers = jsonObj[1].answers.length;
                let correctans = jsonObj[2].correctAnswer;
                let Qsql = 'INSERT INTO questions VALUES (NULL,"' + question + '")' ;
                console.log(Qsql)
                con.query(Qsql, function(err, result, fields){
                    if (err) throw err;
                    else {
                    console.log(result.insertId)
                       let quid = result.insertId;
                       for(let i = 0; i < answers; i++){
                           let answer = jsonObj[1].answers[i].answerdesc;
                           let corr = 0;
                           if(jsonObj[1].answers[i].answerdesc == correctans){
                                corr = 1;
                           }
                           let ansSql = 'INSERT INTO answers VALUES (NULL,' + quid + ',"' + answer + '",' + corr + ')';
                           console.log(ansSql)
                           con.query(ansSql, function(err2, result2, fields){
                                if (err2) throw err2;
                                else{
                                    console.log(result2);
                                }
                                if(i == (answer - 1)){
                                    res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin':'*'});
                                    res.write("question added");
                                    res.end();
                                }
                            });
                       }
                       
                    }
                });

            });
        }else{
            var json = '';
            req.on('data', function (chunk){
                json += chunk.toString('utf8');
            });
            req.on('end', function (){
                console.log(json);
                var jsonObj = JSON.parse(json);
                console.log(jsonObj);
                console.log(jsonObj[0].questionID)
                let sql1 = 'UPDATE questions SET questionDesc = "' + jsonObj[0].questiondesc + '" WHERE questionID = ' + jsonObj[0].questionID;
                console.log(sql1);
                con.query(sql1, function(err, result, fields){
                    if (err) throw err;
                    for(let i = 0; i < jsonObj[1].answers.length; i++){
                        let correct = 0;
                        if(jsonObj[2].correctAnswer == jsonObj[1].answers[i].answerdesc){
                            correct = 1;
                        }
                        let sql2 = 'UPDATE answers SET answer = "' + jsonObj[1].answers[i].answerdesc + '", correct_answer = ' + correct + ' WHERE answerID = ' + jsonObj[1].answers[i].answerId;
                        console.log(sql2);
                        con.query(sql2, function(err, result, fields){
                            if (err) throw err;
                            if(i == (jsonObj[1].answers.length - 1)){
                                res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin':'*'});
                                res.write("question Edit");
                                res.end();
                            }
                        });
                    }
                });
                
            });

        }

    }else if(req.method === "PUT"){
        
    }
        
    
    
});
server.listen(8080);
