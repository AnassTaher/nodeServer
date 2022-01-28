//Database setup:
const sqlite = require("sqlite3").verbose();
let db = my_database("./phones.db");

//Express app setup:
var express = require("express");
var app = express();

//Middleware setup:
var bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.json());


//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)
//NOTE!: CHECK ERROR HANDLING AND PACKAGE.JSON REQUIREMENTS FOR THIS ASSIGNMENT (ESPECIALLY DEPENDENCIES LIKE: NODEMON)

//SIDENOTE: NOT ALL ERRORS SHOULD BE SHOWN TO THE CUSTOMERS

//Function that checks if there is an id of a phone
function findID(id){
	let idFound = false;
    db.get("SELECT * FROM phones WHERE id=" + id, function(err, row) {

		if(err){
			console.log("error");
			return false;
		}
		
		if(row == undefined){
			idFound = false;
			console.log("false id");
		} else{
			idFound = true;
			console.log("id found");
		}
		
		
		
    });
	console.log(id);
	console.log(idFound);
	return idFound;
}

//Select all phones
//Works
app.get("/phones", function(req, res) {
    db.all(`SELECT * FROM phones`, function(err, rows) {
		if(rows.length == 0){
			res.status(404).json("Error 404");
		} else{
			res.status(200);
		}
    	res.json(rows);
    });
});

//Select a specific phone
//Works
app.get("/phones/:id", function(req, res) {

    db.all("SELECT * FROM phones WHERE id=" + req.params.id, function(err,rows){
		if(rows.length == 0){
			res.status(404).json("Error 404");
		} else{
			res.status(200);
		}
    	res.json(rows);
    });
});


app.put("/updatephone/:id", (req, res) => {
	db.run(`UPDATE phones set brand= ?, model = ?, os = ?, image = ?, screensize = ? WHERE id = ?`,
	[req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize, req.params.id],
		(err) => {
			if (err) {
				res.status(400).json(req.body);
				return;
			}
			res.json({
				message: "Update succes",
			})
		});
})

//Insert a phone into the database
//Works (finish error handling)
//Check input
app.post("/post-example", function(req, res) {
	
	db.run(`INSERT INTO phones (brand, model, os, image, screensize)
	VALUES (?, ?, ?, ?, ?)`,
	[req.body.brand, req.body.model, req.body.os, req.body.image,  req.body.screensize], function(err){
	if (err) {
		res.status(400).json({ "error": err.message })
		return;
	}
	return res.json(req.body);
	});
});
 
//Delete a specific phone from the database
//Doesnt work????
app.delete("/delete/:id", function(req, res){
    db.all("SELECT * FROM phones WHERE id=" + req.params.id, function(err, rows) {

		if(err){
			return res.status(404).json("Error 404");
		}
		
		if(rows.length === 0){
			console.log("not defined");
			return res.status(400).json("Error 400");
		} 
		
		db.run("DELETE FROM phones WHERE id =" + req.params.id,function (err, rows){
			if(err){
				res.status(400).json("Error 400");
			} else{
				res.status(200);
			}
			res.json({ "message": "id: " + req.params.id + " deleted" })
		});
		
    });

})


//Delete all the phones from the database
//Works
// app.delete("/reset", (req, res) => {
// 	db.run("DELETE FROM phones", function (err, rows) {
// 			if (err) {
// 				res.status(404).send("Error 404");
// 			} else{
// 				res.status(200).send("Succesfully deleted");
// 			}
// 		});
// })


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log("Connected to the phones database.");
	});
	// Create our phones table if it does not exist already:
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
				console.log("Inserted dummy phone entry into empty database");
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}