const js2xmlparser = require("js2xmlparser");
const protobuf = require("protobufjs");


const data = {
  name: "Alice",
  age: 28,
  email: "alice@example.com"
};

// Step 2: Serialize to JSON
const jsonData = JSON.stringify(data);
console.log("JSON Data:", jsonData);

// Step 3: Serialize to XML
const xmlData = js2xmlparser.parse("person", data);
console.log("XML Data:", xmlData);

// Step 4: Serialize to Protobuf
protobuf.load("person.proto", function (err, root) {
  if (err) throw err;

  // Get the Person type from the protobuf definition
  const Person = root.lookupType("Person");

  // Verify the data matches the schema
  const errMsg = Person.verify(data);
  if (errMsg) throw Error(errMsg);

  // Create a Protobuf message from the data
  const message = Person.create(data);

  // Serialize the message to a buffer
  const buffer = Person.encode(message).finish();
  console.log("Protobuf Data (Buffer):", buffer);

  // Deserialize the Protobuf buffer back into an object
  const decodedData = Person.decode(buffer);
  console.log("Decoded Data:", decodedData);
});
