import React, { useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Text, Alert } from "react-native";
import Svg, { Path, Line } from "react-native-svg";
import { db, ref, onValue } from "../firebase";
import background from "../assets/background6.png";

// Fungsi untuk membuat path busur (arc)
const createArc = (cx, cy, r, startAngle, endAngle) => {
  const x1 = cx + r * Math.cos((Math.PI * startAngle) / 180);
  const y1 = cy - r * Math.sin((Math.PI * startAngle) / 180);
  const x2 = cx + r * Math.cos((Math.PI * endAngle) / 180);
  const y2 = cy - r * Math.sin((Math.PI * endAngle) / 180);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return `M${x1},${y1} A${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2}`;
};

const Car = () => {
  const [motorTemp, setmotorTemp] = useState(0);
  const [batteryTemp, setbatteryTemp] = useState(0);

  useEffect(() => {
    const data = ref(db);

    onValue(data, (snapshot) => {
      const newMotorTemp = Math.round(snapshot.val().motorTemp);
      const newBatteryTemp = Math.round(snapshot.val().batteryTemp);

      setmotorTemp(newMotorTemp);
      setbatteryTemp(newBatteryTemp);

      // Cek suhu dan tampilkan notifikasi jika lebih dari 70 derajat
      if (newMotorTemp > 70) {
        Alert.alert("Peringatan", "Temperatur motor melebihi 70°C!");
      }

      if (newBatteryTemp > 70) {
        Alert.alert("Peringatan", "Temperatur baterai melebihi 70°C!");
      }
    });
  }, [db]);

  const getRotation = (value) => {
    // Fungsi untuk mengubah nilai 0-100 menjadi sudut rotasi (misalnya -90 sampai 90 derajat)
    return ((value / 100) * 180) - 90;
  };

  return (
    <ImageBackground source={background} style={styles.container}>
      {/* Indikator Temperatur motor*/}
      <View style={styles.gaugeContainer}>
        <Text style={styles.label}>Temperatur Motor</Text>
        <View style={styles.gauge}>
          <Svg height="200" width="200" viewBox="0 0 200 100">
            {/* Busur Hijau (0-30) */}
            <Path
              d={createArc(100, 100, 80, 180, 120)} // Busur dari 180 ke 120 derajat
              stroke="#00FF00"
              strokeWidth="15"
              fill="none"
            />
            {/* Busur Kuning (30-70) */}
            <Path
              d={createArc(100, 100, 80, 120, 60)} // Busur dari 120 ke 60 derajat
              stroke="#FFFF00"
              strokeWidth="15"
              fill="none"
            />
            {/* Busur Merah (70-100) */}
            <Path
              d={createArc(100, 100, 80, 60, 0)} // Busur dari 60 ke 0 derajat
              stroke="#FF0000"
              strokeWidth="15"
              fill="none"
            />
            {/* Jarum */}
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="black"
              strokeWidth="4"
              transform={`rotate(${getRotation(motorTemp)}, 100, 100)`}
            />
          </Svg>
          <Text style={styles.value}>{motorTemp}°C</Text>
        </View>
      </View>

      {/* Indikator Temperatur baterai */}
      <View style={styles.gaugeContainer}>
        <Text style={styles.label}>Temperatur Baterai</Text>
        <View style={styles.gauge}>
          <Svg height="200" width="200" viewBox="0 0 200 100">
            {/* Busur Hijau (0-30) */}
            <Path
              d={createArc(100, 100, 80, 180, 120)} // Busur dari 180 ke 120 derajat
              stroke="#00FF00"
              strokeWidth="15"
              fill="none"
            />
            {/* Busur Kuning (30-70) */}
            <Path
              d={createArc(100, 100, 80, 120, 60)} // Busur dari 120 ke 60 derajat
              stroke="#FFFF00"
              strokeWidth="15"
              fill="none"
            />
            {/* Busur Merah (70-100) */}
            <Path
              d={createArc(100, 100, 80, 60, 0)} // Busur dari 60 ke 0 derajat
              stroke="#FF0000"
              strokeWidth="15"
              fill="none"
            />
            {/* Jarum */}
            <Line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="black"
              strokeWidth="4"
              transform={`rotate(${getRotation(batteryTemp)}, 100, 100)`}
            />
          </Svg>
          <Text style={styles.value}>{batteryTemp}°C</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Car;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  gaugeContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  label: {
    fontSize: 24,
    color: "#FFF",
    marginBottom: 10,
  },
  gauge: {
    alignItems: "center",
  },
  value: {
    fontSize: 20,
    color: "#FFF",
    marginTop: 10,
  },
});
