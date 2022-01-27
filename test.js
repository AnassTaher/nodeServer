var express = require("express");
var app = express();

app.use(express.json());

const courses = [
   {id: 1, name: "course 1"},
   {id: 2, name: "course 2"},
   {id: 3, name: "course 3"},
]

app.get("/", (req, res) => {
   res.send("hello world");
});

app.get("/api/courses", (req, res) => {
   res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course){
      res.status(404).send("404 error message");
   }
   res.send(course);
});

app.post("/api/courses", (req,res) => {
   const course = {
      id: courses.length + 1, 
      name: req.body.name
   };
   courses.push(course);
   res.send(course);
})

app.listen(3000, () => console.log("Listening on port 3000"))
