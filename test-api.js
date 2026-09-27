const http = require("http");
const app = require("./app");

const server = http.createServer(app);

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: 0,
      method,
      path,
      headers: {}
    };

    options.port = server.address().port;

    let body = "";
    if (data !== undefined) {
      body = JSON.stringify(data);
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let response = "";
      res.on("data", (chunk) => response += chunk);
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(response);
        } catch {
          parsed = {};
        }
        resolve({ status: res.statusCode, body: parsed });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function check(condition, message) {
    if (condition) {
      passed++;
      console.log(`PASS: ${message}`);
    } else {
      failed++;
      console.log(`FAIL: ${message}`);
    }
  }

  console.log("===============================================");
  console.log("Student Management API Test Suite");
  console.log("===============================================");

  let response = await request("GET", "/");
  check(response.status === 200 && response.body.success === true, "GET / works");

  response = await request("GET", "/students");
  check(response.status === 200 && Array.isArray(response.body.data), "GET /students returns students");

  response = await request("GET", "/students/1");
  check(response.status === 200 && response.body.data.id === 1, "GET /students/1 works");

  response = await request("GET", "/students/999");
  check(response.status === 404, "GET invalid student returns 404");

  response = await request("POST", "/students", { course: "Testing" });
  check(response.status === 400, "POST without name returns 400");

  response = await request("POST", "/students", {
    name: "Test Student",
    course: "Testing",
    age: 20,
    email: "test@example.com"
  });
  const newId = response.body.data && response.body.data.id;
  check(response.status === 201 && newId, "POST creates a new student");

  response = await request("PUT", `/students/${newId}`, { age: 21 });
  check(response.status === 200 && response.body.data.age === 21, "PUT updates student");

  response = await request("PUT", "/students/999");
  check(response.status === 404, "PUT invalid student returns 404");

  response = await request("DELETE", `/students/${newId}`);
  check(response.status === 200, "DELETE removes student");

  response = await request("DELETE", "/students/999");
  check(response.status === 404, "DELETE invalid student returns 404");

  response = await request("GET", "/wrong-route");
  check(response.status === 404, "Unknown route returns 404");

  console.log("===============================================");
  console.log(`Test Summary: ${passed} passed, ${failed} failed`);
  console.log("===============================================");

  server.close(() => {
    process.exitCode = failed === 0 ? 0 : 1;
  });
}

server.listen(0, () => {
  runTests().catch((error) => {
    console.error(error);
    server.close(() => process.exit(1));
  });
});
