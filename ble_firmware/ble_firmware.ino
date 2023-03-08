//=========================
// Libraries
//=========================
#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <HX711.h>
#include <Wire.h>
#include "Adafruit_MPRLS.h"  // Library for the pressure sensor
#include <DFRobot_BMX160.h>  // Library for the IMU sensor. Link: https://github.com/DFRobot/DFRobot_BMX160

//=========================
// Compiler Constants
//=========================
// SAMPLE Service
#define SAMPLE_SERVICE_UUID "cb0f22c6-1000-4737-9f86-1c33f4ee9eea"
// #define SAMPLE_LOAD_CELLS_CHARACTERISTIC_UUID "cb0f22c6-1001-41a0-93d4-9025f8b5eafe"
#define SAMPLE_PRESSURE_CHARACTERISTIC_UUID "5b0f4072-bc69-11ed-afa1-0242ac120002"
// #define SAMPLE_IMU_CHARACTERISTIC_UUID "69615e4e-bc69-11ed-afa1-0242ac120002"

//=========================
// Device Instantiations
//=========================
// HX711 Load Cell Amplifier
// HX711 scale;

// Creating an object for the IMU sensor
DFRobot_BMX160 bmx160;
// Pressure sensor inits
// You dont *need* a reset and EOC pin for most uses, so we set to -1 and don't connect
#define RESET_PIN -1  // set to any GPIO pin # to hard-reset on begin()
#define EOC_PIN -1    // set to any GPIO pin to read end-of-conversion by pin
Adafruit_MPRLS mpr = Adafruit_MPRLS(RESET_PIN, EOC_PIN);


//=========================
// Global Variables
//=========================
// float calibration_factor = -24000;  // Follow the SparkFun guide to get this value
bool client_is_connected = false;
// Load Cell Amplifier Pins
// const int HX711_DOUT = GPIO_NUM_5;
// const int HX711_CLK = GPIO_NUM_4;
// BLE Server
BLEServer* pServer;
// Characteristics
BLECharacteristic* pressureCharacteristic;
// BLECharacteristic* imuCharacteristic;
BLECharacteristic* loadCellCharacteristic;


//=========================
// State Machine Flags
//=========================
// bool load_cell_sampling_enabled = false;
bool pressure_sampling_enabled = false;
bool imu_sampling_enabled = false;

//=========================
// Function Headers
//=========================
void notifyPressure(float);
// void notifyIMU(float);
// void notifyWeight(void);
void setupBLEServer(void);
void setupSampleService(void);
void setupAdvertisementData(void);
void setupPressureSensor(void);
// void setupIMU(void);
void read_Pressure(float*);
// void read_IMU(float*, float*, float*, float*, float*, float*, float*, float*, float*);
// void setupLoadCells(void);
// void stateMachine(void);

//=========================
// Classes
//=========================
// BLE Callbacks
class BaseBLEServerCallbacks : public BLEServerCallbacks
// Callback triggered when a client device connects or disconnects
{
  void onConnect(BLEServer* pServer) {
    client_is_connected = true;
    Serial.println("Device connected");
  }

  void onDisconnect(BLEServer* pServer) {
    client_is_connected = false;
    Serial.println("Device disconnected");
    // Restart advertising
    pServer->getAdvertising()->start();
  }
};

// class SampleLoadCellCallback : public BLECharacteristicCallbacks {
//   void onRead(BLECharacteristic* pLoadCellCharacteristic) {
//     Serial.println("SampleLoadCellCallback->onRead: Called");
//     float weight = scale.get_units();
//     Serial.print("Weight: ");
//     Serial.print(weight, 1);
//     Serial.println(" kg");
//     std::string result = "{weight: " + std::to_string(weight) + "}";
//     pLoadCellCharacteristic->setValue(weight);
//   }
// };
class SamplePressureCallback : public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic* pPressureCharacteristic) {
    Serial.println("SamplePressureCallback->onRead: Called");
    float pressure;
    read_Pressure(&pressure);
    Serial.print("Pressure: ");
    Serial.print(pressure, 1);
    Serial.println(" mBar");
    std::string result = "{pressure: " + std::to_string(pressure) + "}";
    pPressureCharacteristic->setValue(pressure);
  }
};
// class SampleIMUCallback : public BLECharacteristicCallbacks {
//   void onRead(BLECharacteristic* pIMUCharacteristic) {
//     Serial.println("SampleIMUCallback->onRead: Called");
//     float weight = scale.get_units();
//     Serial.print("Weight: ");
//     Serial.print(weight, 1);
//     Serial.println(" kg");
//     std::string result = "{weight: " + std::to_string(weight) + "}";
//     pIMUCharacteristic->setValue(weight);
//   }
// };

// class LoadCellDescriptorCallback : public BLEDescriptorCallbacks
// // Callback triggered when loadcell descriptor listener is attached/removed
// // Enables or disables sampling and notification of weight
// {
//   void onWrite(BLEDescriptor* pLoadCellDescriptor) {
//     Serial.println("LoadCellDescriptorCallback->onWrite: Called");
//     u_int8_t desc = (*(pLoadCellDescriptor->getValue()));
//     Serial.println(std::to_string(desc).c_str());
//     if (desc == 1) {
//       Serial.println("Notify on");
//       load_cell_sampling_enabled = true;
//     } else {
//       Serial.println("Notify off");
//       load_cell_sampling_enabled = false;
//     }
//   }
// };
class PressureDescriptorCallback : public BLEDescriptorCallbacks
// Callback triggered when loadcell descriptor listener is attached/removed
// Enables or disables sampling and notification of weight
{
  void onWrite(BLEDescriptor* pPressureDescriptor) {
    Serial.println("PressureDescriptorCallback->onWrite: Called");
    u_int8_t desc = (*(pPressureDescriptor->getValue()));
    Serial.println(std::to_string(desc).c_str());
    if (desc == 1) {
      Serial.println("Notify on");
      pressure_sampling_enabled = true;
    } else {
      Serial.println("Notify off");
      pressure_sampling_enabled = false;
    }
  }
};
// class IMUDescriptorCallback : public BLEDescriptorCallbacks
// // Callback triggered when loadcell descriptor listener is attached/removed
// // Enables or disables sampling and notification of weight
// {
//   void onWrite(BLEDescriptor* pIMUDescriptor) {
//     Serial.println("IMUDescriptorCallback->onWrite: Called");
//     u_int8_t desc = (*(pIMUDescriptor->getValue()));
//     Serial.println(std::to_string(desc).c_str());
//     if (desc == 1) {
//       Serial.println("Notify on");
//       imu_sampling_enabled = true;
//     } else {
//       Serial.println("Notify off");
//       imu_sampling_enabled = false;
//     }
//   }
// };

void setup() {
  // Setup USB Serial
  Serial.begin(115200);
  Serial.println("Initializing Test with IMU and Pressure Sensors");

  setupPressureSensor();
  delay(500);
  // setupIMU();
  // delay(500);

  // Setup HX711 and Load Cells
  // Serial.println("--Setting up HX711--");
  // setupLoadCells();

  // Setup BLE
  Serial.println("--Setting up BLE Server--");
  setupBLEServer();
  setupSampleService();
  setupAdvertisementData();

  Serial.println("--Setup Complete--");
}

void loop() {
  // Serial.println("Loop");
  // ------------------
  // State Machine
  // ------------------
  if (client_is_connected)
  // Do nothing if no client is connected
  {
    // Serial.println("Client connected");
    float pressure_hPa;
    // float mag_x;
    // float mag_y;
    // float mag_z;
    // float gyr_x;
    // float gyr_y;
    // float gyr_z;
    // float acc_x;
    // float acc_y;
    // float acc_z;

    read_Pressure(&pressure_hPa);  // Extracting the Pressure Data by calling the function
    // read_IMU(&mag_x, &mag_y, &mag_z, &gyr_x, &gyr_y, &gyr_z, &acc_x, &acc_y, &acc_z); // Extracting the IMU Data by calling the function

    // Serial.println(pressure_hPa, DEC);
    // Serial.println("Acc X");
    // Serial.println(acc_x, DEC);
    // Serial.println(acc_y, DEC);
    // Serial.println(acc_z, DEC);
    // Serial.println(gyr_x, DEC);
    // Serial.println(gyr_y, DEC);
    // Serial.println(gyr_z, DEC);
    // Serial.println(mag_x, DEC);
    // Serial.println(mag_y, DEC);
    // Serial.println(mag_z, DEC);
    // stateMachine();
    notifyPressure(pressure_hPa);
    
    // notifyIMU(bmx160);
  }
}

// void stateMachine(void) {
//   if (load_cell_sampling_enabled) {
//     notifyWeight();
//   }
// }

void notifyPressure(float pressure) {
  pressureCharacteristic->setValue(pressure);
  pressureCharacteristic->notify();
}

// void notifyIMU(DFRobot_BMX160 bmx160) {
//   imuCharacteristic->setValue(bmx160);
//   imuCharacteristic->notify();
// }

// void notifyWeight(void) {
//   float weight = scale.get_units(5);
//   loadCellCharacteristic->setValue(weight);
//   loadCellCharacteristic->notify();
// }

void setupBLEServer(void) {
  BLEDevice::init("BLE_SERVER");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BaseBLEServerCallbacks());

  BLEAddress mac_address = BLEDevice::getAddress();
  std::string address = mac_address.toString();
  Serial.println("BLE server setup: SUCCESS");
  Serial.print("MAC: ");
  Serial.println(address.c_str());
}

void setupSampleService(void) {
  BLEService* sampleService = pServer->createService(SAMPLE_SERVICE_UUID);

  // Weight/Load Cell Sample Characteristic
  // loadCellCharacteristic = sampleService->createCharacteristic(
  //   SAMPLE_LOAD_CELLS_CHARACTERISTIC_UUID,
  //   BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  // loadCellCharacteristic->setCallbacks(new SampleLoadCellCallback());
  // loadCellCharacteristic->setValue("PENDING");

  // Pressure Sample Characteristic
  pressureCharacteristic = sampleService->createCharacteristic(
    SAMPLE_PRESSURE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pressureCharacteristic->setCallbacks(new SamplePressureCallback());
  pressureCharacteristic->setValue("PENDING");

  // IMU Sample Characteristic
  // imuCharacteristic = sampleService->createCharacteristic(
  //   SAMPLE_IMU_CHARACTERISTIC_UUID,
  //   BLECharacteristic::PROPERTY_READ |
  //   BLECharacteristic::PROPERTY_NOTIFY);
  // imuCharacteristic->setCallbacks(new SampleIMUCallback());
  // imuCharacteristic->setValue("PENDING");

  // -- create CCC descriptors for notification service and listener callbacks --

  // Load Cell CCC descriptor
  // BLEDescriptor* pLoadCellCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  // pLoadCellCCCDescriptor->setCallbacks(new LoadCellDescriptorCallback());
  // loadCellCharacteristic->addDescriptor(pLoadCellCCCDescriptor);

  // Pressure CCC descriptor
  BLEDescriptor* pPressureCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  pPressureCCCDescriptor->setCallbacks(new PressureDescriptorCallback());
  pressureCharacteristic->addDescriptor(pPressureCCCDescriptor);

  // IMU CCC descriptor
  // BLEDescriptor* pIMUCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  // pIMUCCCDescriptor->setCallbacks(new IMUDescriptorCallback());
  // imuCharacteristic->addDescriptor(pIMUCCCDescriptor);

  sampleService->start();

  Serial.println("setupSampleService setup: SUCCESS");
}

void setupAdvertisementData(void) {
  BLEAdvertising* pAdvertising = pServer->getAdvertising();
  BLEAdvertisementData advertisementData;
  // Set properties of advertisement data
  pAdvertising->setAdvertisementData(advertisementData);
  pAdvertising->start();
}

void setupPressureSensor(void) {
  Serial.println("Finding the Pressure Sensor");
  if (!mpr.begin()) {
    Serial.println("Failed to communicate with MPRLS sensor, check wiring?");
    while (1) {
      delay(10);
    }
  }
  Serial.println("Found the Pressure Sensor");
}

// void setupIMU(void) {
//   if (bmx160.begin() != true) {
//     Serial.println("initializing the IMU failed");
//     while (1)
//       ;
//   }
// }

void read_Pressure(float* pressure_hPa) {
  *pressure_hPa = mpr.readPressure();
  delay(7);
}

// void read_IMU(float* mag_x, float* mag_y, float* mag_z, float* gyr_x, float* gyr_y, float* gyr_z, float* acc_x, float* acc_y, float* acc_z) {
//   sBmx160SensorData_t Omagn, Ogyro, Oaccel;

//   /* Get a new sensor event */
//   bmx160.getAllData(&Omagn, &Ogyro, &Oaccel);
//   *mag_x = Omagn.x;
//   *mag_y = Omagn.y;
//   *mag_z = Omagn.z;
//   *gyr_x = Ogyro.x;
//   *gyr_y = Ogyro.y;
//   *gyr_z = Ogyro.z;
//   *acc_x = Oaccel.x;
//   *acc_y = Oaccel.y;
//   *acc_z = Oaccel.z;
//   delay(7);
// }

// void setupLoadCells(void) {
//   pinMode(HX711_CLK, OUTPUT);
//   pinMode(HX711_DOUT, INPUT);

//   scale.begin(HX711_DOUT, HX711_CLK);
//   scale.set_scale(calibration_factor);
//   scale.tare();  // Reset the scale to 0

//   long zero_factor = scale.read_average();  // Get a baseline reading
//   Serial.println("setupLoadCells setup: SUCCESS");
// }