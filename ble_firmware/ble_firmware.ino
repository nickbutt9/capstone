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
#define SAMPLE_MAG_CHARACTERISTIC_UUID "69615e4e-bc69-11ed-afa1-0242ac120002"
#define SAMPLE_ACC_CHARACTERISTIC_UUID "51eff9c5-1329-4244-80c3-e8757d7fa46c"
#define SAMPLE_GYR_CHARACTERISTIC_UUID "5e6db078-bdea-11ed-afa1-0242ac120002"

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
BLECharacteristic* magCharacteristic;
BLECharacteristic* accCharacteristic;
BLECharacteristic* gyrCharacteristic;
BLECharacteristic* loadCellCharacteristic;

byte magPacketArray[12];
byte accPacketArray[12];
byte gyrPacketArray[12];

//=========================
// State Machine Flags
//=========================
// bool load_cell_sampling_enabled = false;

//=========================
// Function Headers
//=========================
void notifyPressure(float);
void notifyIMU(byte*, BLECharacteristic*);
// void notifyWeight(void);
void setupBLEServer(void);
void setupSampleService(void);
void setupAdvertisementData(void);
void setupPressureSensor(void);
void setupIMU(void);
void read_Pressure(float*);
void read_IMU(float*, float*, float*, float*, float*, float*, float*, float*, float*);
void makePacket(float*, float*, float*, float*, float*, float*, float*, float*, float*, byte*);
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
class SampleMagCallback : public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic* pMagCharacteristic) {
    Serial.println("SampleMagCallback->onRead: Called");
    float imu;
    Serial.print("IMU: ");
    Serial.print(imu, 1);
    Serial.println(" m/s");
    std::string result = "{imu: " + std::to_string(imu) + "}";
    pMagCharacteristic->setValue(imu);
  }
};
class SampleAccCallback : public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic* pAccCharacteristic) {
    Serial.println("SampleAccCallback->onRead: Called");
    float imu;
    Serial.print("IMU: ");
    Serial.print(imu, 1);
    Serial.println(" m/s");
    std::string result = "{imu: " + std::to_string(imu) + "}";
    pAccCharacteristic->setValue(imu);
  }
};
class SampleGyrCallback : public BLECharacteristicCallbacks {
  void onRead(BLECharacteristic* pGyrCharacteristic) {
    Serial.println("SampleGyrCallback->onRead: Called");
    float imu;
    Serial.print("IMU: ");
    Serial.print(imu, 1);
    Serial.println(" m/s");
    std::string result = "{imu: " + std::to_string(imu) + "}";
    pGyrCharacteristic->setValue(imu);
  }
};
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
  }
};
class MagDescriptorCallback : public BLEDescriptorCallbacks
// Callback triggered when loadcell descriptor listener is attached/removed
// Enables or disables sampling and notification of weight
{
  void onWrite(BLEDescriptor* pMagDescriptor) {
    Serial.println("MagDescriptorCallback->onWrite: Called");
    u_int8_t desc = (*(pMagDescriptor->getValue()));
    Serial.println(std::to_string(desc).c_str());
  }
};
class AccDescriptorCallback : public BLEDescriptorCallbacks
// Callback triggered when loadcell descriptor listener is attached/removed
// Enables or disables sampling and notification of weight
{
  void onWrite(BLEDescriptor* pAccDescriptor) {
    Serial.println("AccDescriptorCallback->onWrite: Called");
    u_int8_t desc = (*(pAccDescriptor->getValue()));
    Serial.println(std::to_string(desc).c_str());
  }
};
class GyrDescriptorCallback : public BLEDescriptorCallbacks
// Callback triggered when loadcell descriptor listener is attached/removed
// Enables or disables sampling and notification of weight
{
  void onWrite(BLEDescriptor* pGyrDescriptor) {
    Serial.println("GyrDescriptorCallback->onWrite: Called");
    u_int8_t desc = (*(pGyrDescriptor->getValue()));
    Serial.println(std::to_string(desc).c_str());
  }
};

void setup() {
  // Setup USB Serial
  Serial.begin(115200);
  Serial.println("Initializing Test with IMU and Pressure Sensors");

  setupPressureSensor();
  delay(500);
  setupIMU();
  delay(500);

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
    float mag_x;
    float mag_y;
    float mag_z;
    float gyr_x;
    float gyr_y;
    float gyr_z;
    float acc_x;
    float acc_y;
    float acc_z;

    read_Pressure(&pressure_hPa);                                                      // Extracting the Pressure Data by calling the function
    read_IMU(&mag_x, &mag_y, &mag_z, &gyr_x, &gyr_y, &gyr_z, &acc_x, &acc_y, &acc_z);  // Extracting the IMU Data by calling the function

    Serial.println(pressure_hPa, DEC);
    Serial.println("Acc X");
    Serial.println(acc_x, DEC);
    Serial.println(acc_y, DEC);
    Serial.println(acc_z, DEC);
    Serial.println(gyr_x, DEC);
    Serial.println(gyr_y, DEC);
    Serial.println(gyr_z, DEC);
    Serial.println(mag_x, DEC);
    Serial.println(mag_y, DEC);
    Serial.println(mag_z, DEC);
    // stateMachine();

    notifyPressure(pressure_hPa);
    makePacket(&mag_x, &mag_y, &mag_z, magPacketArray);
    notifyIMU(magPacketArray, magCharacteristic);
    makePacket(&acc_x, &acc_y, &acc_z, accPacketArray);
    notifyIMU(accPacketArray, accCharacteristic);
    makePacket(&gyr_x, &gyr_y, &gyr_z, gyrPacketArray);
    notifyIMU(gyrPacketArray, gyrCharacteristic);
  }
}

// void stateMachine(void) {
//   if (load_cell_sampling_enabled) {
//     notifyWeight();
//   }
// }

void makePacket(float* x, float* y, float* z, byte* packetArray) {

  packetArray[0] = ((byte*)x)[0];
  packetArray[1] = ((byte*)x)[1];
  packetArray[2] = ((byte*)x)[2];
  packetArray[3] = ((byte*)x)[3];
  packetArray[4] = ((byte*)y)[0];
  packetArray[5] = ((byte*)y)[1];
  packetArray[6] = ((byte*)y)[2];
  packetArray[7] = ((byte*)y)[3];
  packetArray[8] = ((byte*)z)[0];
  packetArray[9] = ((byte*)z)[1];
  packetArray[10] = ((byte*)z)[2];
  packetArray[11] = ((byte*)z)[3];
}

void notifyPressure(float pressure) {
  pressureCharacteristic->setValue(pressure);
  pressureCharacteristic->notify();
}


void notifyIMU(byte* packet, BLECharacteristic* characteristic) {

  byte array[12];
  for (int i = 0; i < 12; i++) {
    array[i] = packet[i];
  }

  characteristic->setValue(array, 12);
  characteristic->notify();
}

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
  magCharacteristic = sampleService->createCharacteristic(
    SAMPLE_MAG_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  magCharacteristic->setCallbacks(new SampleMagCallback());
  magCharacteristic->setValue("PENDING");
  accCharacteristic = sampleService->createCharacteristic(
    SAMPLE_ACC_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  accCharacteristic->setCallbacks(new SampleAccCallback());
  accCharacteristic->setValue("PENDING");
  gyrCharacteristic = sampleService->createCharacteristic(
    SAMPLE_GYR_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  gyrCharacteristic->setCallbacks(new SampleGyrCallback());
  gyrCharacteristic->setValue("PENDING");

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
  BLEDescriptor* pMagCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  pMagCCCDescriptor->setCallbacks(new MagDescriptorCallback());
  magCharacteristic->addDescriptor(pMagCCCDescriptor);
  // IMU CCC descriptor
  BLEDescriptor* pAccCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  pAccCCCDescriptor->setCallbacks(new AccDescriptorCallback());
  accCharacteristic->addDescriptor(pAccCCCDescriptor);
  // IMU CCC descriptor
  BLEDescriptor* pGyrCCCDescriptor = new BLEDescriptor((uint16_t)0x2902);
  pGyrCCCDescriptor->setCallbacks(new GyrDescriptorCallback());
  gyrCharacteristic->addDescriptor(pGyrCCCDescriptor);

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

void setupIMU(void) {
  if (bmx160.begin() != true) {
    Serial.println("initializing the IMU failed");
    while (1)
      delay(10);
  }
}

void read_Pressure(float* pressure_hPa) {
  *pressure_hPa = mpr.readPressure();
  delay(7);
}

void read_IMU(float* mag_x, float* mag_y, float* mag_z, float* gyr_x, float* gyr_y, float* gyr_z, float* acc_x, float* acc_y, float* acc_z) {
  sBmx160SensorData_t Omagn, Ogyro, Oaccel;

  /* Get a new sensor event */
  bmx160.getAllData(&Omagn, &Ogyro, &Oaccel);
  *mag_x = Omagn.x;
  *mag_y = Omagn.y;
  *mag_z = Omagn.z;
  *gyr_x = Ogyro.x;
  *gyr_y = Ogyro.y;
  *gyr_z = Ogyro.z;
  *acc_x = Oaccel.x;
  *acc_y = Oaccel.y;
  *acc_z = Oaccel.z;
  delay(7);
}

// void setupLoadCells(void) {
//   pinMode(HX711_CLK, OUTPUT);
//   pinMode(HX711_DOUT, INPUT);

//   scale.begin(HX711_DOUT, HX711_CLK);
//   scale.set_scale(calibration_factor);
//   scale.tare();  // Reset the scale to 0

//   long zero_factor = scale.read_average();  // Get a baseline reading
//   Serial.println("setupLoadCells setup: SUCCESS");
// }