//Database setup:
const sqlite = require("sqlite3").verbose();
let db = my_database("./phones.db");

//Express app setup:
var express = require("express");
var app = express();

//Middleware setup:
var bodyParser = require("body-parser");
app.use(bodyParser.json());

//Select all phones
app.get("/phones/list/all", function(req, res){
	db.all(`SELECT * FROM phones`, function(err, rows){
		if (err) {
			return res.status(400).json("400");
		}
		if(rows.length === 0){
			return res.status(404).json("Error 404");
		} 
		return res.status(200).json(rows);
	});
});

//Select a specific phone
app.get("/phones/list/:id", function(req, res){

	db.all("SELECT * FROM phones WHERE id=" + req.params.id, function(err,rows){
		if (err) {
			return res.status(400).json("400");
		}
		if(rows.length === 0){
			return res.status(404).json("Error 404");
		} 
		return res.status(200).json(rows);
	});
});

//Update a specific phone
app.put("/phones/update/:id", function(req, res){
	db.all("SELECT * FROM phones WHERE id=" + req.params.id, function(err, rows) {
		if(err){
			return res.status(400).json("Error 400");
		}
		if(rows.length === 0){
			return res.status(404).json("Error 404");
		}
		db.run(`UPDATE phones set brand= ?, model = ?, os = ?, image = ?, screensize = ? WHERE id = ?`,
		[req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize, req.params.id],
		function(){
			return res.status(200).json("Phone succesfully updated");
		});
	});
});

//Insert a phone into the database
app.post("/phones/post", function(req, res){
	db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
	[req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize], function(err){
		if (err) {
			return res.status(400).json("400");
		}
		return res.status(200).json("Phone succesfully added");
	});
});

//Delete a specific phone from the database
app.delete("/phones/delete/:id", function(req, res){
	var id = req.params.id;
	db.all("SELECT * FROM phones WHERE id=" + id, function(err, rows) {
		if(err){
			return res.status(400).json("Error 400");
		}
		if(rows.length === 0){
			return res.status(404).json("Error 404");
		}
		db.run("DELETE FROM phones WHERE id =" + id, function (){
			return res.status(200).json("id: " + id + " succesfully deleted");
		});
		
	});

});

//Create local server on port 3000
app.listen(3000);

function my_database(filename) {
	var db = new sqlite.Database(filename);
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
			} else {
			}
		});
	});
	return db;
}