// import dependencies
import express from 'express';

// import port from .env file or default to 8080
const port = process.env.PORT || 8080;

// create an instance of express app
const app = express();

// middleware to parse JSON bodies in requests
app.use(express.json());

// middleware to log various examples of request properties
app.use((req, res, next) => {
    //•	Try updating the middleware log code to show more by adding this into the code
//console.log(`${req.method} ${req.url}  `);
//console.log(`${req.method} request made at ${req.url} -- Body: ${JSON.stringify(req.body)} `);
    console.log(`${req.method}${req.url} `);
    console.log(`${req.method} request made at ${req.url} -- Body: ${JSON.stringify(req.body)} `);
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// routing is a way to define how an application responds to a client request to a particular endpoint
// lets add more routes to our server.js file:
app.get('/about', (req, res) => {
  res.send('About Page');
});

app.post('/submit', (req, res) => {
  res.send('Form Submitted');
});
app.put('/update', (req, res) => {
  res.send('Update Successful');
});
app.delete('/delete', (req, res) => {
  res.send('Delete Successful');
});

// RESTful API for managing employees
let employeesList = [];

app.get('/api/employees', (req, res) => {
  res.json(employeesList);
});

app.post('/api/employees', (req, res) => {
  const { employee_id, name, email } = req.body;
  // Ensure employee_id is stored as a string
  const id = employee_id ? String(employee_id) : employee_id;
  const newEmployee = { employee_id: id, name, email };
  employeesList.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:employee_id', (req, res) => {
  const { employee_id } = req.params;
  const { name, email } = req.body;
  const targetId = String(employee_id);
  const updatedEmployee = { employee_id: targetId, name, email };
  
  employeesList = employeesList.map(employee =>
    String(employee.employee_id) === targetId ? updatedEmployee : employee
  );

  res.json(updatedEmployee);
});

app.delete('/api/employees/:employee_id', (req, res) => {
  const { employee_id } = req.params;
  const targetId = String(employee_id);
  const originalLength = employeesList.length;
  employeesList = employeesList.filter(employee => String(employee.employee_id) !== targetId);

  if (employeesList.length === originalLength) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  res.status(204).send();
});


//Error-handling middleware should come after all your route handlers and other middleware. This ensures it catches any errors thrown during request processing.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


//404 handler should be the last middleware in your file. It only runs if no other route matched the request.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// set server to listen on port and console log it is running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// export app
export default app;