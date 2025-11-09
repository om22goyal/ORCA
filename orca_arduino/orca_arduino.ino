#include <WiFi.h>
#include <WebServer.h>

// WiFi credentials – replace with your own network details
const char* ssid     = "Om";
const char* password = "om123456";

// Motor control pins (using digitalWrite only)
const int motorPinLeft  = 5;   // Left motor (GPIO15 - strapping pin; ensure proper configuration)
const int motorPinRight = 18;  // Right motor (GPIO2)

// Create a web server listening on port 80
WebServer server(80);

// Timer variables for handling a 5-second turn delay
bool waiting = false;           // Set to true when a turn command is active
unsigned long actionStartTime = 0;

// --- Web Server Handlers ---

// Serve the control page
void handleRoot() {
  String html = "<html><head><title>Remote Boat Control</title></head><body>";
  html += "<h1>Remote Boat Control</h1>";
  html += "<p><a href='/w'><button style='width:100px;height:50px'>Forward</button></a></p>";
  html += "<p><a href='/s'><button style='width:100px;height:50px'>Stop</button></a></p>";
  html += "<p><a href='/a'><button style='width:100px;height:50px'>Left Turn</button></a></p>";
  html += "<p><a href='/d'><button style='width:100px;height:50px'>Right Turn</button></a></p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

// Handle Forward command: both motors on
void handleForward() {
  waiting = false;  // Cancel any pending turn action
  digitalWrite(motorPinLeft, HIGH);
  digitalWrite(motorPinRight, HIGH);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "Forward: Both motors ON");
}

// Handle Stop command: both motors off
void handleStop() {
  waiting = false;  // Cancel any pending turn action
  digitalWrite(motorPinLeft, LOW);
  digitalWrite(motorPinRight, LOW);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "Stop: Both motors OFF");
}

// Handle Left Turn command: only left motor on for 5 seconds, then resume forward
void handleLeft() {
  waiting = true;
  actionStartTime = millis();
  digitalWrite(motorPinLeft, HIGH);  // Turn on left motor
  digitalWrite(motorPinRight, LOW);  // Turn off right motor
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "Left Turn: Left motor ON for 5 seconds");
}

// Handle Right Turn command: only right motor on for 5 seconds, then resume forward
void handleRight() {
  waiting = true;
  actionStartTime = millis();
  digitalWrite(motorPinLeft, LOW);   // Turn off left motor
  digitalWrite(motorPinRight, HIGH); // Turn on right motor
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "Right Turn: Right motor ON for 5 seconds");
}

void setup() {
  Serial.begin(115200);
  
  // Set up motor pins as outputs and start with motors off
  pinMode(motorPinLeft, OUTPUT);
  pinMode(motorPinRight, OUTPUT);
  digitalWrite(motorPinLeft, LOW);
  digitalWrite(motorPinRight, LOW);
  
  //wifi
  WiFi.disconnect(true);  // clear previous settings
  delay(1000);

  WiFi.begin(ssid, password);
  Serial.println("Attempting to connect to WiFi...");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print("Attempt ");
    Serial.print(attempts + 1);
    Serial.print(": WiFi status = ");
    Serial.println(WiFi.status());
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Failed to connect to WiFi.");
  }

  
  // Set up web server routes
  server.on("/", handleRoot);
  server.on("/w", handleForward);
  server.on("/s", handleStop);
  server.on("/a", handleLeft);
  server.on("/d", handleRight);
  server.begin();
  Serial.println("HTTP server started. Open the above IP in a browser to control the boat remotely.");
}

void loop() {
  // Handle incoming client requests
  server.handleClient();
  
  // Check if a turn command is active
  if (waiting) {
    if (millis() - actionStartTime >= 5000) {
      // After 5 seconds, resume forward motion (both motors on)
      digitalWrite(motorPinLeft, HIGH);
      digitalWrite(motorPinRight, HIGH);
      waiting = false;
      Serial.println("Turn completed: Resuming forward motion (both motors ON).");
    }
  }
}