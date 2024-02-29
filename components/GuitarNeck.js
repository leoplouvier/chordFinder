import React, { useEffect, useState } from "react";
import { ScrollView, Image, View, Dimensions,TouchableOpacity } from "react-native";
import { Button, Text } from "galio-framework";
import { theme } from "../utils/styleUtils";
import { changeChord, withAccessToStore } from "../redux/store";
import { getChordWithPosition } from "../services/httpService";
import { useTranslation } from "react-i18next";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const GuitarNeck = (props) => {
  const { t, i18n } = useTranslation();
  const init = props.state.chord && props.state.chord.strings
    ? props.state.chord.strings.split(" ")
    : ["X", "X", "X", "X", "X", "X"];
  const [neckCases, changeNeck] = useState(init)
  const [loading, setLoading] = useState(false)
  const neck = require(".././assets/guitarNeck.png")
  const help = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21]
  const cases = new Array(6).fill(new Array(22).fill(0))
  const windowHeight = Dimensions.get('window').height
  
  const findChord = async () => {
    setLoading(true);
    let chord = "";
    neckCases.forEach((c, index) => {
      chord += index == 0 ? c : "-" + c;
    });
    let chordResponse = await getChordWithPosition(chord);
    if (chordResponse && !chordResponse.error) {
      changeChord(chordResponse);
      props.onPress();
    }
    setLoading(false);
  };
  useEffect(()=>{
    const fingering =  props.state.chord && props.state.chord.strings
    ? props.state.chord.strings.split(" ")
    : ["X", "X", "X", "X", "X", "X"]
    changeNeck(fingering)
  }, [props.state.chord])

  return (
    <View
      style={{
        ...props.style,
        justifyContent: "center",
        alignItems: "center",
        height: Dimensions.get('window').height - 150 - 70 -150, //-150 for header -70 for margin -150 for buttons
        marginTop:70
      }}
    >
      <ScrollView style={{ width: Dimensions.get('window').width }}>
        <Image
          source={neck}
          style={{
            width: "70%",
            marginLeft: "15%",
            resizeMode: "stretch",
          }}
        />
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            width: "70%",
            left: "15%",
            top: 5,
          }}
        >
          {neckCases.map((c, index) => {
            return (
              <View key={index + "emptyStringContainer"} style={{width:Dimensions.get('window').width*0.7 /6, justifyContent:"flex-start",alignItems: "center"}}>
                <View
                  key={index + "emptyString"}
                  style={{
                    height: [0, 5].includes(index)
                      ? 1960
                      : [1, 4].includes(index)
                      ? 1965
                      : 1975,
                    width: 11 - index,
                    minWidth: 7,
                    backgroundColor:
                      c === "X" ? theme.color.inactive : theme.color.primary,
                    opacity: ["0", 0, "X"].includes(c) ? 1 : 0,
                  }}
                ></View>
              </View>
            );
          })}
        </View>
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            width: "70%",
            left: "15%",
            top: 40
          }}
        >
          {cases.map((c, index) => {
            return (
              <View key={index}>
                {c.map((string, i) => {
                  return (
                    <Button
                      key={i}
                      color="transparent"
                      shadowless
                      style={{
                        width: Dimensions.get('window').width*0.7 /6,
                        height: getCasesHeight(i),
                        margin: 0,
                        justifyContent:"center",
                        alignItems:"center"
                      }}
                      onPress={() => {
                        let oldNeckState = [...neckCases];
                        oldNeckState[index] = i + 1;
                        changeNeck(oldNeckState);
                      }}
                    >
                      {neckCases[index] == i + 1 ? (
                        <View
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 25,
                            backgroundColor: theme.color.primary,
                          }}
                        ></View>
                      ) : (
                        <View></View>
                      )}
                    </Button>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 40,
          }}
        >
          {help.map((h) => {
            return (
              <View
                key={h + "help"}
                style={{ marginTop: getHelpTop(h), alignItems: "center" }}
              >
                <Text h3 style={{ color: "#fff" }}>
                  {" " + h + " "}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View
        style={{ position: "absolute", bottom: -150, alignItems: "center", height:150}}
      >
        <View style={{ flexDirection: "row",width:0.7*Dimensions.get('window').width,height:windowHeight > 700 ? 70 : 50,alignItems:"center",justifyContent:"center" }}>
          {neckCases.map((c, index) => {
            return (
              <View key={index + "action"}>
                <TouchableOpacity 
                  onPress={() => {
                    let newNeckState = [...neckCases];
                    newNeckState[index] = "0";
                    changeNeck(newNeckState);
                  }}
                  style={{
                    width: 0.7*Dimensions.get('window').width/6,
                    height: "50%",
                    justifyContent:"center",
                    alignItems:"center"
                  }}>
                  <FontAwesome5 
                  name="circle" 
                  size={windowHeight > 700 ? 20 : 17} 
                  color={
                    ["0", 0].includes(c)
                      ? theme.color.primary
                      : theme.color.darkPrimary
                  } 
                  solid={["0", 0].includes(c)} 
                 />
                </TouchableOpacity >
                <TouchableOpacity 
                  onPress={() => {
                    let newNeckState = [...neckCases];
                    newNeckState[index] = "X";
                    changeNeck(newNeckState);
                  }}
                  style={{
                    width: 0.7*Dimensions.get('window').width/6,
                    height: "50%",
                    justifyContent:"center",
                    alignItems:"center"
                  }}>
                  <FontAwesome5 
                  name="ban" 
                  size={windowHeight > 700 ? 20 : 17} 
                  color={
                    c === "X" ? theme.color.inactive : theme.color.darkInactive
                  }
                  regular 
                 />
                </TouchableOpacity >
              </View>
            );
          })}
        </View>
        <Button
          color={theme.color.primary}
          onPress={findChord}
          style={{ height: windowHeight > 700 ? 50 : 40,marginTop:20}}
          disabled={neckCases.join("") == "XXXXXX"}
          loading={loading}
          loadingColor={theme.color.background}
        >
         <Text style={{color:theme.color.background}}>{t("FIND_CHORD")}</Text> 
        </Button>
      </View>
    </View>
  );
};
const getHelpTop = (help) => {
  switch (help) {
    case 1:
      return 40;
    case 3:
      return 200;
    case 5:
    case 12:
      return 180;
    case 7:
    case 15:
      return 160;
    case 9:
      return 130;
    default:
      return 90;
  }
};
const getCasesHeight = (index) => {
  // DIMENSION en cm des cases
  // 1 & 2 : 2,2
  // 3 & 4 : 2
  // 5 & 6 : 1,8
  // 7 & 8 : 1,6
  // 9 & 10 : 1,4
  // 11 & + : 1,6
  switch (index) {
    case 0:
    case 1:
      return 130;
    case 2:
    case 3:
      return 119;
    case 4:
    case 5:
      return 105;
    case 6:
    case 7:
      return 94;
    case 8:
    case 9:
      return 82;
    default:
      return 70;
  }
};

export default withAccessToStore(GuitarNeck);
