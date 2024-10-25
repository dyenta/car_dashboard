#include <WiFi.h>
#include <FirebaseESP32.h>
#include <SPI.h>
#include "max6675.h"

// Firebase config
#define FIREBASE_HOST "car-dashboard-f0dcb-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "AIzaSyAhD7liFP3-j2RPuDzv2nD3whCaCZ7JgZE"

// Wi-Fi credentials
#define WIFI_SSID "nyinya"
#define WIFI_PASSWORD "tanyadyenta"

// Define MAX6675 pins
#define SCK_PIN 18  // Pin for SCK
#define CS_PIN1 5   // Pin for Chip Select for Motor Temp Thermocouple
#define CS_PIN2 17  // Pin for Chip Select for Battery Temp Thermocouple
#define SO_PIN 19   // Pin for SO (data out)

// Initialize thermocouples
MAX6675 thermocouple1(SCK_PIN, CS_PIN1, SO_PIN); // First thermocouple (Motor Temperature)
MAX6675 thermocouple2(SCK_PIN, CS_PIN2, SO_PIN); // Second thermocouple (Battery Temperature)

WiFiClient wifiClient;
FirebaseData firebaseData;

void connectToWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nConnected to WiFi");
}

void setup() {
  Serial.begin(115200);
  connectToWiFi();

  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  // Initialize thermocouples (no need for begin() with MAX6675)
}

void loop() {
  // Read data from first thermocouple (Motor Temperature)
  float motorTemp = thermocouple1.readCelsius();
  
  // Read data from second thermocouple (Battery Temperature)
  float batteryTemp = thermocouple2.readCelsius();

  // Check if any reads failed and exit early (to try again).
  if (isnan(motorTemp) || isnan(batteryTemp)) {
    Serial.println("Failed to read data from thermocouples");
    delay(2000);
    return;
  }

  // Print data to Serial Monitor
  Serial.print("Motor Temperature: ");
  Serial.print(motorTemp);
  Serial.println(" °C");

  Serial.print("Battery Temperature: ");
  Serial.print(batteryTemp);
  Serial.println(" °C");

  // Send data to Firebase if ready
  if (Firebase.ready()) {
    // Send motor data to Firebase
    Firebase.setFloat(firebaseData, "/motorTemp", motorTemp);

    // Send battery data to Firebase
    Firebase.setFloat(firebaseData, "/batteryTemp", batteryTemp);
  } else {
    Serial.println("Firebase not ready");
  }

  // Delay between readings
  delay(5000);
}